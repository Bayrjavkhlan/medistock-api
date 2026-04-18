import {
  EquipmentState,
  InventoryStatus,
  OrganizationType,
} from "@prisma/client";
import { queryField } from "nexus";

import { DashboardOverviewObjectType } from "../types";

type TimeRange = {
  label: string;
  start: Date;
  end: Date;
};

const monthLabels = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

const getLastMonths = (count: number): TimeRange[] => {
  const now = new Date();
  const ranges: TimeRange[] = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - index + 1, 1);

    ranges.push({
      label: monthLabels[start.getMonth()] ?? `${start.getMonth() + 1}-р сар`,
      start,
      end,
    });
  }

  return ranges;
};

const toAddress = (
  address?: {
    address1?: string | null;
    address2?: string | null;
    province?: string | null;
  } | null
) =>
  [address?.address1, address?.address2, address?.province]
    .filter(Boolean)
    .join(", ");

const safeDate = (value?: Date | null) => (value ? value.toISOString() : null);

const toMapPayload = (
  hospitals: Array<{
    id: string;
    organization: {
      name: string;
      address: {
        address1: string;
        address2: string | null;
        province: string;
        latitude: number | null;
        longitude: number | null;
      } | null;
    };
  }>,
  drugstores: Array<{
    id: string;
    organization: {
      name: string;
      address: {
        address1: string;
        address2: string | null;
        province: string;
        latitude: number | null;
        longitude: number | null;
      } | null;
    };
  }>
) => ({
  hospitals: hospitals.flatMap((hospital) => {
    const address = hospital.organization.address;
    if (address?.latitude == null || address.longitude == null) return [];

    return [
      {
        id: hospital.id,
        name: hospital.organization.name,
        type: "hospital",
        address: address.address1,
        address2: address.address2,
        province: address.province,
        opensAt: "08:30",
        closesAt: "17:30",
        latitude: address.latitude,
        longitude: address.longitude,
      },
    ];
  }),
  drugstores: drugstores.flatMap((pharmacy) => {
    const address = pharmacy.organization.address;
    if (address?.latitude == null || address.longitude == null) return [];

    return [
      {
        id: pharmacy.id,
        name: pharmacy.organization.name,
        type: "drugstore",
        address: address.address1,
        address2: address.address2,
        province: address.province,
        opensAt: "09:00",
        closesAt: "21:00",
        latitude: address.latitude,
        longitude: address.longitude,
      },
    ];
  }),
});

const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildAdminOverview = async (ctx: any) => {
  const months = getLastMonths(6);

  const [
    totalHospitals,
    totalPharmacies,
    totalDrugs,
    totalEquipment,
    totalStaff,
    totalLogs,
    hospitals,
    pharmacies,
    recentHospitalRows,
    recentPharmacyRows,
    recentDrugRows,
    recentLogRows,
    topPharmacyRows,
    topHospitalRows,
    lowStockRows,
    availableCount,
    lowCount,
    outCount,
    unknownCount,
    hospitalMissingLocationCount,
    pharmacyMissingLocationCount,
    pharmacyWithoutInventoryCount,
  ] = await Promise.all([
    ctx.prisma.hospital.count(),
    ctx.prisma.pharmacy.count(),
    ctx.prisma.drug.count(),
    ctx.prisma.equipment.count(),
    ctx.prisma.membership.count(),
    ctx.prisma.equipmentLog.count(),
    ctx.prisma.hospital.findMany({
      include: { organization: { include: { address: true } } },
      orderBy: { createdAt: "desc" },
    }),
    ctx.prisma.pharmacy.findMany({
      include: {
        organization: { include: { address: true } },
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    ctx.prisma.hospital.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { organization: true },
    }),
    ctx.prisma.pharmacy.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { organization: true },
    }),
    ctx.prisma.drug.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    ctx.prisma.equipmentLog.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        equipment: true,
        performedBy: true,
      },
    }),
    ctx.prisma.pharmacy.findMany({
      take: 5,
      include: {
        organization: true,
        inventory: true,
      },
      orderBy: { inventory: { _count: "desc" } },
    }),
    ctx.prisma.hospital.findMany({
      take: 5,
      include: {
        organization: {
          include: {
            memberships: true,
          },
        },
        equipments: true,
        bookings: true,
      },
      orderBy: { equipments: { _count: "desc" } },
    }),
    ctx.prisma.pharmacyDrug.findMany({
      take: 5,
      where: {
        OR: [
          { quantity: { lte: 10 } },
          {
            status: { in: [InventoryStatus.LOW, InventoryStatus.OUT_OF_STOCK] },
          },
        ],
      },
      orderBy: [{ quantity: "asc" }, { updatedAt: "desc" }],
      include: {
        drug: true,
        pharmacy: { include: { organization: true } },
      },
    }),
    ctx.prisma.pharmacyDrug.count({
      where: { status: InventoryStatus.AVAILABLE },
    }),
    ctx.prisma.pharmacyDrug.count({ where: { status: InventoryStatus.LOW } }),
    ctx.prisma.pharmacyDrug.count({
      where: { status: InventoryStatus.OUT_OF_STOCK },
    }),
    ctx.prisma.pharmacyDrug.count({
      where: { status: InventoryStatus.UNKNOWN },
    }),
    ctx.prisma.hospital.count({
      where: {
        organization: {
          address: {
            is: {
              OR: [{ latitude: null }, { longitude: null }],
            },
          },
        },
      },
    }),
    ctx.prisma.pharmacy.count({
      where: {
        organization: {
          address: {
            is: {
              OR: [{ latitude: null }, { longitude: null }],
            },
          },
        },
      },
    }),
    ctx.prisma.pharmacy.count({
      where: {
        inventory: { none: {} },
      },
    }),
  ]);

  const growthSeries = await Promise.all(
    [
      {
        key: "hospitals",
        label: "Эмнэлэг",
        color: "#0f766e",
        count: (range: TimeRange) =>
          ctx.prisma.hospital.count({
            where: {
              createdAt: {
                gte: range.start,
                lt: range.end,
              },
            },
          }),
      },
      {
        key: "pharmacies",
        label: "Эмийн сан",
        color: "#0284c7",
        count: (range: TimeRange) =>
          ctx.prisma.pharmacy.count({
            where: {
              createdAt: {
                gte: range.start,
                lt: range.end,
              },
            },
          }),
      },
      {
        key: "drugs",
        label: "Эм",
        color: "#7c3aed",
        count: (range: TimeRange) =>
          ctx.prisma.drug.count({
            where: {
              createdAt: {
                gte: range.start,
                lt: range.end,
              },
            },
          }),
      },
      {
        key: "logs",
        label: "Лог",
        color: "#f97316",
        count: (range: TimeRange) =>
          ctx.prisma.equipmentLog.count({
            where: {
              createdAt: {
                gte: range.start,
                lt: range.end,
              },
            },
          }),
      },
    ].map(async (series) => ({
      key: series.key,
      label: series.label,
      color: series.color,
      points: await Promise.all(
        months.map(async (range) => ({
          label: range.label,
          value: await series.count(range),
        }))
      ),
    }))
  );

  const recentItems = [
    ...recentHospitalRows.map((item: any) => ({
      id: `hospital-${item.id}`,
      title: item.organization.name,
      subtitle: "Шинээр бүртгэгдсэн эмнэлэг",
      meta: item.email ?? item.phone ?? "Холбоо барих мэдээлэл дутуу",
      href: `/admin/hospital/${item.id}`,
      createdAt: safeDate(item.createdAt),
    })),
    ...recentPharmacyRows.map((item: any) => ({
      id: `pharmacy-${item.id}`,
      title: item.organization.name,
      subtitle: "Шинээр бүртгэгдсэн эмийн сан",
      meta: item.email ?? item.phone ?? "Холбоо барих мэдээлэл дутуу",
      href: `/admin/pharmacy/${item.id}`,
      createdAt: safeDate(item.createdAt),
    })),
    ...recentDrugRows.map((item: any) => ({
      id: `drug-${item.id}`,
      title: item.name,
      subtitle: "Шинэ эмийн бүртгэл",
      meta: item.manufacturer ?? item.genericName ?? "Тайлбар дутуу",
      href: `/admin/medicine/${item.id}`,
      createdAt: safeDate(item.createdAt),
    })),
    ...recentLogRows.map((item: any) => ({
      id: `log-${item.id}`,
      title: item.equipment?.name ?? "Төхөөрөмж",
      subtitle: "Сүүлийн логийн бүртгэл",
      meta: item.performedBy?.name ?? item.description,
      href: "/admin/equipment/log",
      createdAt: safeDate(item.createdAt),
    })),
  ]
    .sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt
        ? new Date(right.createdAt).getTime()
        : 0;
      return rightTime - leftTime;
    })
    .slice(0, 8);

  return {
    stats: [
      {
        label: "Нийт эмнэлэг",
        value: totalHospitals,
        helper: "Платформд бүртгэлтэй эмнэлгүүд",
        tone: "teal",
      },
      {
        label: "Нийт эмийн сан",
        value: totalPharmacies,
        helper: "Идэвхтэй эмийн сангууд",
        tone: "blue",
      },
      {
        label: "Нийт эм",
        value: totalDrugs,
        helper: "Каталогт бүртгэлтэй эмүүд",
        tone: "violet",
      },
      {
        label: "Тоног төхөөрөмж",
        value: totalEquipment,
        helper: "Системд бүртгэлтэй төхөөрөмж",
        tone: "amber",
      },
      {
        label: "Ажилтан / эрх",
        value: totalStaff,
        helper: "Байгууллагын membership бүртгэл",
        tone: "slate",
      },
      {
        label: "Логийн бүртгэл",
        value: totalLogs,
        helper: "Сүүлийн үйл ажиллагааны ул мөр",
        tone: "rose",
      },
    ],
    growthSeries,
    inventoryStatus: [
      {
        label: "Боломжтой",
        value: availableCount,
        helper: "Худалдаалагдаж буй listing",
        tone: "success",
      },
      {
        label: "Нөөц багатай",
        value: lowCount,
        helper: "Анхаарал шаардлагатай listing",
        tone: "warning",
      },
      {
        label: "Дууссан",
        value: outCount,
        helper: "Одоогоор олдохгүй listing",
        tone: "danger",
      },
      {
        label: "Тодорхойгүй",
        value: unknownCount,
        helper: "Статус дутуу listing",
        tone: "neutral",
      },
    ],
    recentItems,
    topHospitals: topHospitalRows.map((item: any) => ({
      label: item.organization.name,
      value: item.equipments.length,
      helper: `${item.bookings.length} захиалга • ${item.organization.memberships.length} ажилтан`,
      tone: "teal",
    })),
    topPharmacies: topPharmacyRows.map((item: any) => ({
      label: item.organization.name,
      value: item.inventory.length,
      helper: item.organization.address?.province ?? "Байршил дутуу",
      tone: "blue",
    })),
    alerts: [
      {
        id: "low-stock",
        title: "Нөөцийн анхааруулга",
        description: lowStockRows.length
          ? `${lowStockRows.length} listing дээр нөөц багатай эсвэл дууссан төлөв бүртгэгдсэн байна.`
          : "Одоогоор ноцтой нөөцийн анхааруулга алга.",
        severity: lowStockRows.length ? "warning" : "success",
      },
      {
        id: "missing-location",
        title: "Байршлын мэдээлэл дутуу байгууллага",
        description: `${hospitalMissingLocationCount} эмнэлэг, ${pharmacyMissingLocationCount} эмийн сан газрын зургийн координатгүй байна.`,
        severity:
          hospitalMissingLocationCount + pharmacyMissingLocationCount > 0
            ? "info"
            : "success",
      },
      {
        id: "empty-inventory",
        title: "Нөөцгүй эмийн сан",
        description:
          pharmacyWithoutInventoryCount > 0
            ? `${pharmacyWithoutInventoryCount} эмийн санд нэг ч эмийн listing бүртгэгдээгүй байна.`
            : "Бүх эмийн сан дор хаяж нэг listing-тэй байна.",
        severity: pharmacyWithoutInventoryCount > 0 ? "warning" : "success",
      },
    ],
    map: toMapPayload(hospitals, pharmacies),
  };
};

const buildHospitalOverview = async (ctx: any) => {
  const organizationId = ctx.activeOrg?.organization.id;
  if (!organizationId) return null;

  const months = getLastMonths(6);

  const hospital = await ctx.prisma.hospital.findUnique({
    where: { organizationId },
    include: {
      organization: {
        include: {
          address: true,
          memberships: true,
        },
      },
      equipments: true,
      bookings: true,
    },
  });

  if (!hospital) return null;

  const [recentLogs, upcomingBookings, pharmacies] = await Promise.all([
    ctx.prisma.equipmentLog.findMany({
      take: 6,
      where: {
        equipment: {
          hospital: {
            organizationId,
          },
        },
      },
      include: {
        equipment: true,
        performedBy: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    ctx.prisma.booking.findMany({
      take: 6,
      where: {
        hospital: {
          organizationId,
        },
        bookingTime: {
          gte: new Date(),
        },
      },
      orderBy: { bookingTime: "asc" },
    }),
    ctx.prisma.pharmacy.findMany({
      include: {
        organization: {
          include: {
            address: true,
          },
        },
        inventory: true,
      },
    }),
  ]);

  const equipmentStates = [
    {
      label: "Боломжтой",
      value: hospital.equipments.filter(
        (item: any) => item.state === EquipmentState.AVAILABLE
      ).length,
      helper: "Ашиглах боломжтой төхөөрөмж",
      tone: "success",
    },
    {
      label: "Хуваарилагдсан",
      value: hospital.equipments.filter(
        (item: any) => item.state === EquipmentState.ASSIGNED
      ).length,
      helper: "Хэрэглэгчид оноогдсон төхөөрөмж",
      tone: "teal",
    },
    {
      label: "Засвартай",
      value: hospital.equipments.filter(
        (item: any) => item.state === EquipmentState.IN_MAINTENANCE
      ).length,
      helper: "Засварын явцад байгаа төхөөрөмж",
      tone: "warning",
    },
    {
      label: "Эвдрэлтэй",
      value: hospital.equipments.filter(
        (item: any) => item.state === EquipmentState.OUT_OF_ORDER
      ).length,
      helper: "Яаралтай анхаарах төхөөрөмж",
      tone: "danger",
    },
  ];
  const maintenanceAndBrokenCount =
    (equipmentStates[2]?.value ?? 0) + (equipmentStates[3]?.value ?? 0);

  const activitySeries = await Promise.all(
    [
      {
        key: "equipment",
        label: "Төхөөрөмж",
        color: "#0f766e",
        count: (range: TimeRange) =>
          ctx.prisma.equipment.count({
            where: {
              hospital: { organizationId },
              createdAt: { gte: range.start, lt: range.end },
            },
          }),
      },
      {
        key: "bookings",
        label: "Захиалга",
        color: "#0284c7",
        count: (range: TimeRange) =>
          ctx.prisma.booking.count({
            where: {
              hospital: { organizationId },
              createdAt: { gte: range.start, lt: range.end },
            },
          }),
      },
      {
        key: "logs",
        label: "Лог",
        color: "#f97316",
        count: (range: TimeRange) =>
          ctx.prisma.equipmentLog.count({
            where: {
              equipment: { hospital: { organizationId } },
              createdAt: { gte: range.start, lt: range.end },
            },
          }),
      },
    ].map(async (series) => ({
      key: series.key,
      label: series.label,
      color: series.color,
      points: await Promise.all(
        months.map(async (range) => ({
          label: range.label,
          value: await series.count(range),
        }))
      ),
    }))
  );

  const hospitalAddress = hospital.organization.address;

  const nearbyPharmacies = pharmacies
    .map((item: any) => {
      const pharmacyAddress = item.organization.address;
      const canMeasure =
        hospitalAddress?.latitude != null &&
        hospitalAddress.longitude != null &&
        pharmacyAddress?.latitude != null &&
        pharmacyAddress.longitude != null;

      const distanceKm = canMeasure
        ? haversineDistance(
            hospitalAddress.latitude,
            hospitalAddress.longitude,
            pharmacyAddress.latitude,
            pharmacyAddress.longitude
          )
        : null;

      return {
        item,
        distanceKm,
      };
    })
    .filter(({ item, distanceKm }: any) => {
      if (distanceKm != null) return true;
      return (
        item.organization.address?.province != null &&
        item.organization.address?.province === hospitalAddress?.province
      );
    })
    .sort((left: any, right: any) => {
      if (left.distanceKm == null && right.distanceKm == null) return 0;
      if (left.distanceKm == null) return 1;
      if (right.distanceKm == null) return -1;
      return left.distanceKm - right.distanceKm;
    })
    .slice(0, 5)
    .map(({ item, distanceKm }: any) => ({
      id: item.id,
      title: item.organization.name,
      subtitle: toAddress(item.organization.address) || "Хаяг дутуу",
      meta:
        distanceKm != null
          ? `${distanceKm.toFixed(1)} км зайд`
          : (item.organization.address?.province ?? "Ижил бүс"),
      href: null,
      createdAt: null,
    }));

  return {
    profile: {
      id: hospital.id,
      name: hospital.organization.name,
      email: hospital.email,
      phone: hospital.phone,
      address: toAddress(hospital.organization.address) || "Хаяг бүртгэгдээгүй",
      province: hospital.organization.address?.province ?? null,
      latitude: hospital.organization.address?.latitude ?? null,
      longitude: hospital.organization.address?.longitude ?? null,
    },
    stats: [
      {
        label: "Ажилтнууд",
        value: hospital.organization.memberships.length,
        helper: "Байгууллагад хамаарах эрхүүд",
        tone: "teal",
      },
      {
        label: "Төхөөрөмж",
        value: hospital.equipments.length,
        helper: "Системд бүртгэлтэй төхөөрөмж",
        tone: "blue",
      },
      {
        label: "Захиалга",
        value: hospital.bookings.length,
        helper: "Нийт үзлэгийн захиалга",
        tone: "violet",
      },
      {
        label: "Хүлээгдэж буй захиалга",
        value: hospital.bookings.filter(
          (item: any) => item.status === "PENDING"
        ).length,
        helper: "Шийдвэр хүлээж байгаа захиалгууд",
        tone: "amber",
      },
      {
        label: "Логийн бүртгэл",
        value: recentLogs.length,
        helper: "Сүүлийн 6 лог",
        tone: "rose",
      },
      {
        label: "Ойролцоох эмийн сан",
        value: nearbyPharmacies.length,
        helper: "Энэ эмнэлэгт ойр байрлах салбарууд",
        tone: "slate",
      },
    ],
    activitySeries,
    equipmentStates,
    recentLogs: recentLogs.map((item: any) => ({
      id: item.id,
      title: item.equipment?.name ?? "Төхөөрөмж",
      subtitle: item.description,
      meta: item.performedBy?.name ?? "Гүйцэтгэсэн хэрэглэгч тодорхойгүй",
      href: "/hospital/equipment/log",
      createdAt: safeDate(item.createdAt),
    })),
    upcomingBookings: upcomingBookings.map((item: any) => ({
      id: item.id,
      title: item.patientName,
      subtitle: `${item.department} • ${item.status}`,
      meta: `${item.patientPhone} • ${new Date(item.bookingTime).toLocaleString("mn-MN")}`,
      href: null,
      createdAt: safeDate(item.bookingTime),
    })),
    nearbyPharmacies,
    alerts: [
      {
        id: "maintenance",
        title: "Засварын хяналт",
        description:
          maintenanceAndBrokenCount > 0
            ? `${maintenanceAndBrokenCount} төхөөрөмж засвар эсвэл эвдрэлтэй төлөвтэй байна.`
            : "Засвар шаардсан төхөөрөмжийн анхааруулга алга.",
        severity: maintenanceAndBrokenCount > 0 ? "warning" : "success",
      },
      {
        id: "location",
        title: "Байршлын мэдээлэл",
        description:
          hospital.organization.address?.latitude != null &&
          hospital.organization.address?.longitude != null
            ? "Эмнэлгийн байршлын координат бүрэн байна."
            : "Эмнэлгийн байршлын координат дутуу байна.",
        severity:
          hospital.organization.address?.latitude != null &&
          hospital.organization.address?.longitude != null
            ? "success"
            : "info",
      },
    ],
  };
};

const buildPharmacyOverview = async (ctx: any) => {
  const organizationId = ctx.activeOrg?.organization.id;
  if (!organizationId) return null;

  const pharmacy = await ctx.prisma.pharmacy.findUnique({
    where: { organizationId },
    include: {
      organization: {
        include: {
          address: true,
          memberships: true,
        },
      },
      inventory: {
        include: {
          drug: true,
        },
        orderBy: [{ updatedAt: "desc" }],
      },
    },
  });

  if (!pharmacy) return null;

  const months = getLastMonths(6);
  const lowStockItems = pharmacy.inventory.filter(
    (item: any) =>
      item.quantity <= 10 ||
      item.status === InventoryStatus.LOW ||
      item.status === InventoryStatus.OUT_OF_STOCK
  );

  const activitySeries = await Promise.all(
    [
      {
        key: "updates",
        label: "Нөөцийн шинэчлэлт",
        color: "#0284c7",
        count: (range: TimeRange) =>
          ctx.prisma.pharmacyDrug.count({
            where: {
              pharmacy: { organizationId },
              updatedAt: { gte: range.start, lt: range.end },
            },
          }),
      },
      {
        key: "lowStock",
        label: "Эрсдэлтэй нөөц",
        color: "#f97316",
        count: (range: TimeRange) =>
          ctx.prisma.pharmacyDrug.count({
            where: {
              pharmacy: { organizationId },
              updatedAt: { gte: range.start, lt: range.end },
              OR: [
                { quantity: { lte: 10 } },
                {
                  status: {
                    in: [InventoryStatus.LOW, InventoryStatus.OUT_OF_STOCK],
                  },
                },
              ],
            },
          }),
      },
    ].map(async (series) => ({
      key: series.key,
      label: series.label,
      color: series.color,
      points: await Promise.all(
        months.map(async (range) => ({
          label: range.label,
          value: await series.count(range),
        }))
      ),
    }))
  );

  return {
    profile: {
      id: pharmacy.id,
      name: pharmacy.organization.name,
      email: pharmacy.email,
      phone: pharmacy.phone,
      address: toAddress(pharmacy.organization.address) || "Хаяг бүртгэгдээгүй",
      province: pharmacy.organization.address?.province ?? null,
      latitude: pharmacy.organization.address?.latitude ?? null,
      longitude: pharmacy.organization.address?.longitude ?? null,
    },
    stats: [
      {
        label: "Нийт эм",
        value: pharmacy.inventory.length,
        helper: "Энэ эмийн санд бүртгэлтэй listing",
        tone: "teal",
      },
      {
        label: "Боломжтой нөөц",
        value: pharmacy.inventory.filter(
          (item: any) => item.status === InventoryStatus.AVAILABLE
        ).length,
        helper: "Шууд худалдаалах боломжтой listing",
        tone: "success",
      },
      {
        label: "Нөөц багатай",
        value: pharmacy.inventory.filter(
          (item: any) =>
            item.status === InventoryStatus.LOW || item.quantity <= 10
        ).length,
        helper: "Анхаарал шаардсан listing",
        tone: "warning",
      },
      {
        label: "Дууссан",
        value: pharmacy.inventory.filter(
          (item: any) =>
            item.status === InventoryStatus.OUT_OF_STOCK || item.quantity === 0
        ).length,
        helper: "Одоогоор олдохгүй listing",
        tone: "danger",
      },
      {
        label: "Ажилтнууд",
        value: pharmacy.organization.memberships.length,
        helper: "Эмийн сантай холбогдсон эрхүүд",
        tone: "slate",
      },
      {
        label: "Сүүлийн шинэчлэлт",
        value: pharmacy.inventory.slice(0, 5).length,
        helper: "Хамгийн сүүлийн 5 listing шинэчлэлт",
        tone: "blue",
      },
    ],
    activitySeries,
    inventoryStatus: [
      {
        label: "Боломжтой",
        value: pharmacy.inventory.filter(
          (item: any) => item.status === InventoryStatus.AVAILABLE
        ).length,
        helper: "Хэвийн нөөцтэй",
        tone: "success",
      },
      {
        label: "Нөөц багатай",
        value: pharmacy.inventory.filter(
          (item: any) => item.status === InventoryStatus.LOW
        ).length,
        helper: "Шуурхай шинэчлэх шаардлагатай",
        tone: "warning",
      },
      {
        label: "Дууссан",
        value: pharmacy.inventory.filter(
          (item: any) => item.status === InventoryStatus.OUT_OF_STOCK
        ).length,
        helper: "Нийлүүлэлт шаардлагатай",
        tone: "danger",
      },
      {
        label: "Тодорхойгүй",
        value: pharmacy.inventory.filter(
          (item: any) => item.status === InventoryStatus.UNKNOWN
        ).length,
        helper: "Статус нягтлах шаардлагатай",
        tone: "neutral",
      },
    ],
    topDrugs: [...pharmacy.inventory]
      .sort((left: any, right: any) => right.quantity - left.quantity)
      .slice(0, 5)
      .map((item: any) => ({
        id: item.drug.id,
        title: item.drug.name,
        subtitle: item.drug.strength ?? item.drug.dosageForm ?? "Тайлбар дутуу",
        meta: `${item.quantity} ширхэг • ${item.price != null ? `${item.price.toFixed(0)} ₮` : "Үнэ дутуу"}`,
        href: `/pharmacy/medicine/${item.drug.id}`,
        createdAt: safeDate(item.updatedAt),
      })),
    lowStockItems: lowStockItems.slice(0, 5).map((item: any) => ({
      id: item.drug.id,
      title: item.drug.name,
      subtitle: item.status,
      meta: `${item.quantity} ширхэг үлдсэн`,
      href: `/pharmacy/medicine/${item.drug.id}`,
      createdAt: safeDate(item.updatedAt),
    })),
    recentUpdates: pharmacy.inventory.slice(0, 6).map((item: any) => ({
      id: item.id,
      title: item.drug.name,
      subtitle: "Нөөцийн мэдээлэл шинэчлэгдсэн",
      meta: `${item.quantity} ширхэг • ${item.status}`,
      href: `/pharmacy/medicine/${item.drug.id}`,
      createdAt: safeDate(item.updatedAt),
    })),
    alerts: [
      {
        id: "low-stock",
        title: "Нөөцийн эрсдэл",
        description:
          lowStockItems.length > 0
            ? `${lowStockItems.length} эм дээр нөөц багатай эсвэл дууссан төлөв илэрлээ.`
            : "Одоогоор ноцтой нөөцийн эрсдэл алга.",
        severity: lowStockItems.length > 0 ? "warning" : "success",
      },
      {
        id: "location",
        title: "Байршлын мэдээлэл",
        description:
          pharmacy.organization.address?.latitude != null &&
          pharmacy.organization.address?.longitude != null
            ? "Эмийн сангийн байршлын координат бүрэн байна."
            : "Эмийн сангийн координат дутуу байна.",
        severity:
          pharmacy.organization.address?.latitude != null &&
          pharmacy.organization.address?.longitude != null
            ? "success"
            : "info",
      },
    ],
  };
};

export const DashboardOverview = queryField("dashboardOverview", {
  type: DashboardOverviewObjectType,
  resolve: async (_parent, _args, ctx) => {
    const isAdmin = Boolean(ctx.reqUser?.user?.isPlatformAdmin);
    const activeOrg = ctx.activeOrg;

    if (isAdmin) {
      return {
        role: "ADMIN",
        admin: await buildAdminOverview(ctx),
        hospital: null,
        pharmacy: null,
      };
    }

    if (activeOrg?.organization.type === OrganizationType.HOSPITAL) {
      return {
        role: "HOSPITAL",
        admin: null,
        hospital: await buildHospitalOverview(ctx),
        pharmacy: null,
      };
    }

    if (activeOrg?.organization.type === OrganizationType.PHARMACY) {
      return {
        role: "PHARMACY",
        admin: null,
        hospital: null,
        pharmacy: await buildPharmacyOverview(ctx),
      };
    }

    return {
      role: "USER",
      admin: null,
      hospital: null,
      pharmacy: null,
    };
  },
});
