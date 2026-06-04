/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
import { EquipmentLogType } from "@prisma/client";
import { GraphQLError } from "graphql";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

export const SUPPORTED_IMAGING_DEVICES = {
  "definium-656": {
    label: "Definium 656 X-Ray System",
    model: "Definium 656",
    type: "DEF",
    dailyWarning: 180,
    dailyCritical: 260,
    monthlyWarning: 4200,
    monthlyCritical: 6200,
  },
  "magnetom-aera": {
    label: "MAGNETOM Aera MRI System",
    model: "MAGNETOM Aera",
    type: "MRI",
    dailyWarning: 45,
    dailyCritical: 70,
    monthlyWarning: 950,
    monthlyCritical: 1400,
  },
} as const;

export type SupportedImagingDeviceSlug = keyof typeof SUPPORTED_IMAGING_DEVICES;

type Period = "DAILY" | "WEEKLY" | "MONTHLY";

const isSupportedSlug = (slug: string): slug is SupportedImagingDeviceSlug =>
  slug in SUPPORTED_IMAGING_DEVICES;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getPeriodRange = (period: Period) => {
  const end = new Date();
  const start =
    period === "DAILY"
      ? startOfDay(end)
      : addDays(startOfDay(end), period === "WEEKLY" ? -6 : -29);

  return { start, end };
};

const formatDateLabel = (date: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "numeric",
  }).format(date);

const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
  }).format(date);

const getRiskLevel = (score: number) => {
  if (score <= 40) return "LOW";
  if (score <= 70) return "MEDIUM";
  return "HIGH";
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(value)));

const groupCount = <T>(
  rows: T[],
  getKey: (row: T) => string,
  sort?: (left: [string, number], right: [string, number]) => number
) => {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    const key = getKey(row);
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .sort(sort ?? ((left, right) => left[0].localeCompare(right[0])))
    .map(([label, value]) => ({ label, value }));
};

const getWeekLabel = (date: Date) => {
  const start = startOfDay(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  return `${formatDateLabel(start)} 7 хоног`;
};

const buildPdf = (title: string, lines: string[]) => {
  const content = [
    "BT",
    "/F1 18 Tf",
    "50 790 Td",
    `(${title.replace(/[()]/g, "")}) Tj`,
    "/F1 10 Tf",
    ...lines.flatMap((line, index) => [
      index === 0 ? "0 -28 Td" : "0 -16 Td",
      `(${line.replace(/[()]/g, "")}) Tj`,
    ]),
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf).toString("base64");
};

const getDevice = async (ctx: any, slug: string) => {
  if (!isSupportedSlug(slug)) {
    throw new GraphQLError(
      "Analytics is available only for Definium 656 and MAGNETOM Aera.",
      { extensions: { code: "UNSUPPORTED_ANALYTICS_DEVICE" } }
    );
  }

  const config = SUPPORTED_IMAGING_DEVICES[slug];
  const criteria = accessibleBy(ctx.caslAbility, "read", "Equipment");

  const device = await ctx.prisma.equipment.findFirst({
    where: {
      ...criteria,
      model: config.model,
    },
    include: {
      hospital: { include: { organization: true } },
      logs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!device) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

  return { device, config, slug };
};

export const buildImagingAnalytics = async (
  ctx: any,
  slug: string,
  period: Period = "MONTHLY"
) => {
  const { device, config } = await getDevice(ctx, slug);
  const { start, end } = getPeriodRange(period);

  const [periodRows, allRows, maintenanceLogs] = await Promise.all([
    ctx.prisma.imagingStudyImage.findMany({
      where: {
        deviceId: device.id,
        captureDateTime: { gte: start, lte: end },
      },
      orderBy: { captureDateTime: "asc" },
    }),
    ctx.prisma.imagingStudyImage.findMany({
      where: { deviceId: device.id },
      orderBy: { captureDateTime: "asc" },
    }),
    ctx.prisma.equipmentLog.findMany({
      where: {
        equipmentId: device.id,
        type: {
          in: [EquipmentLogType.MAINTENANCE, EquipmentLogType.CALIBRATION],
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalImages = periodRows.length;
  const distinctHours = new Set(
    periodRows.map((row: any) => {
      const date = new Date(row.captureDateTime);
      return `${date.toISOString().slice(0, 13)}:00`;
    })
  ).size;
  const distinctPatients = new Set(
    periodRows.map((row: any) => row.patientCode)
  ).size;
  const periodDays = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / 86_400_000)
  );
  const operatingHours = distinctHours;
  const availableHours = periodDays * 10;
  const utilizationPercentage = clamp((operatingHours / availableHours) * 100);

  const hourly = Array.from({ length: 24 }, (_, hour) => ({
    label: `${String(hour).padStart(2, "0")}:00`,
    value: periodRows.filter(
      (row: any) => new Date(row.captureDateTime).getHours() === hour
    ).length,
  }));
  const daily = groupCount(periodRows, (row: any) =>
    formatDateLabel(new Date(row.captureDateTime))
  );
  const weekly = groupCount(periodRows, (row: any) =>
    getWeekLabel(new Date(row.captureDateTime))
  );
  const monthly = groupCount(allRows, (row: any) =>
    formatMonthLabel(new Date(row.captureDateTime))
  );

  const activeHourly = hourly.filter((point) => point.value > 0);
  const busiestHour = [...hourly].sort((a, b) => b.value - a.value)[0];
  const lowestHour = [...activeHourly].sort((a, b) => a.value - b.value)[0];
  const busiestDay = [...daily].sort((a, b) => b.value - a.value)[0];
  const underutilizedPeriods = activeHourly
    .filter(
      (point) => point.value <= Math.max(1, (busiestHour?.value ?? 0) * 0.25)
    )
    .slice(0, 4)
    .map((point) => point.label);

  const dailyAverage = totalImages / periodDays;
  const monthlyTotal = monthly.at(-1)?.value ?? totalImages;
  const healthLevel =
    dailyAverage >= config.dailyCritical ||
    monthlyTotal >= config.monthlyCritical ||
    utilizationPercentage >= 90
      ? "CRITICAL"
      : dailyAverage >= config.dailyWarning ||
          monthlyTotal >= config.monthlyWarning ||
          utilizationPercentage >= 70
        ? "WARNING"
        : "NORMAL";

  const riskBase =
    (dailyAverage / config.dailyCritical) * 38 +
    (monthlyTotal / config.monthlyCritical) * 34 +
    (utilizationPercentage / 100) * 18 +
    Math.max(0, 10 - maintenanceLogs.length * 2);
  const riskScore = clamp(riskBase);
  const monthGrowth =
    monthly.length >= 2
      ? (((monthly.at(-1)?.value ?? 0) - (monthly.at(-2)?.value ?? 1)) /
          Math.max(1, monthly.at(-2)?.value ?? 1)) *
        100
      : 0;

  const predictions =
    config.type === "DEF"
      ? [
          {
            label: "Рентген гуурс солих эрсдэл",
            riskScore: clamp(riskScore + 8),
            riskLevel: getRiskLevel(clamp(riskScore + 8)),
            recommendation:
              dailyAverage > config.dailyWarning
                ? "Definium 656 төхөөрөмжийн ачаалал хэвийн босгоос давсан. Рентген гуурсын үзлэг хийхийг зөвлөж байна."
                : "Рентген гуурсын ачаалал хэвийн түвшинд байна.",
          },
          {
            label: "Детекторын үйлчилгээний хэрэгцээ",
            riskScore: clamp(utilizationPercentage + 12),
            riskLevel: getRiskLevel(clamp(utilizationPercentage + 12)),
            recommendation:
              "Детекторын ашиглалтын давтамжийг долоо хоног бүр хянаж, пик цагийн дараа чанарын шалгалт хийнэ үү.",
          },
          {
            label: "Калибровк хийх шаардлага",
            riskScore: clamp(monthlyTotal / 70),
            riskLevel: getRiskLevel(clamp(monthlyTotal / 70)),
            recommendation:
              "Сарын зураг авалтын хэмжээ өссөн үед калибровкын шалгалтыг төлөвлөх шаардлагатай.",
          },
        ]
      : [
          {
            label: "Ороомгийн гэмтлийн эрсдэл",
            riskScore: clamp(riskScore + 6),
            riskLevel: getRiskLevel(clamp(riskScore + 6)),
            recommendation:
              "MAGNETOM Aera ороомгийн ашиглалтын давтамж өссөн үед coil тестийг урьдчилан төлөвлөнө үү.",
          },
          {
            label: "Хөргөлтийн системийн үзлэг",
            riskScore: clamp(utilizationPercentage + 10),
            riskLevel: getRiskLevel(clamp(utilizationPercentage + 10)),
            recommendation:
              "Ажиллах цаг нэмэгдсэн тул хөргөлтийн системийн үзлэгийг 30 хоногийн дотор товлохыг зөвлөж байна.",
          },
          {
            label: "Урьдчилан сэргийлэх засвар",
            riskScore: clamp(monthGrowth + 42),
            riskLevel: getRiskLevel(clamp(monthGrowth + 42)),
            recommendation:
              monthGrowth >= 35
                ? "MAGNETOM Aera scan volume increased by 35% this month. Preventive maintenance should be scheduled within 30 days."
                : "Сарын скан ачаалал хэвийн хяналтын мужид байна.",
          },
        ];

  return {
    deviceSlug: slug,
    deviceId: device.id,
    deviceName: config.label,
    hospital: device.hospital?.organization?.name ?? "Тодорхойгүй",
    department: periodRows[0]?.department ?? "Дүрс оношилгоо",
    period,
    stats: {
      totalImages,
      imagesPerHour: Number(
        (totalImages / Math.max(1, operatingHours)).toFixed(2)
      ),
      imagesPerDay: Number((totalImages / periodDays).toFixed(2)),
      imagesPerWeek: Number(
        (totalImages / Math.max(1, periodDays / 7)).toFixed(2)
      ),
      imagesPerMonth: monthlyTotal,
      estimatedOperatingHours: operatingHours,
      averageStudiesPerPatient: Number(
        (totalImages / Math.max(1, distinctPatients)).toFixed(2)
      ),
      utilizationPercentage,
    },
    workload: {
      hourly,
      daily,
      weekly,
      monthly,
      busiestHour: busiestHour?.label ?? "-",
      busiestDay: busiestDay?.label ?? "-",
      peakOperatingHours: activeHourly
        .filter((point) => point.value >= (busiestHour?.value ?? 0) * 0.75)
        .map((point) => point.label),
      lowestOperatingHours: lowestHour ? [lowestHour.label] : [],
      underutilizedPeriods,
    },
    health: {
      level: healthLevel,
      reasons: [
        `Өдрийн дундаж ачаалал: ${dailyAverage.toFixed(1)}`,
        `Сарын нийт зураг/скан: ${monthlyTotal}`,
        `Ашиглалтын хувь: ${utilizationPercentage}%`,
        `Засварын түүх: ${maintenanceLogs.length} бичлэг`,
      ],
    },
    predictions,
    recommendations: predictions.map((prediction) => prediction.recommendation),
  };
};

export const buildPredictiveMaintenance = async (ctx: any) => {
  const devices = await Promise.all(
    (
      Object.keys(SUPPORTED_IMAGING_DEVICES) as SupportedImagingDeviceSlug[]
    ).map((slug) =>
      buildImagingAnalytics(ctx, slug, "MONTHLY").catch(() => null)
    )
  );

  return {
    devices: devices.filter(
      (device): device is NonNullable<(typeof devices)[number]> =>
        Boolean(device)
    ),
  };
};

export const generateAnalyticsReport = async (
  ctx: any,
  slug: string,
  period: Period
) => {
  const analytics = await buildImagingAnalytics(ctx, slug, period);
  const { device } = await getDevice(ctx, slug);
  const { start, end } = getPeriodRange(period);
  const lines = [
    `Device: ${analytics.deviceName}`,
    `Hospital: ${analytics.hospital}`,
    `Period: ${period}`,
    `Total images/scans: ${analytics.stats.totalImages}`,
    `Utilization: ${analytics.stats.utilizationPercentage}%`,
    `Busiest hour: ${analytics.workload.busiestHour}`,
    `Busiest day: ${analytics.workload.busiestDay}`,
    `Health: ${analytics.health.level}`,
    ...analytics.predictions.map(
      (prediction: any) =>
        `${prediction.label}: ${prediction.riskScore}% ${prediction.riskLevel}`
    ),
    ...analytics.recommendations,
  ];
  const pdfBase64 = buildPdf(`${analytics.deviceName} Analytics Report`, lines);
  const fileName = `${slug}-${period.toLowerCase()}-analytics-report.pdf`;

  const report = await ctx.prisma.analyticsReport.create({
    data: {
      deviceId: device.id,
      period,
      periodStart: start,
      periodEnd: end,
      fileName,
      pdfBase64,
    },
  });

  return {
    id: report.id,
    deviceName: analytics.deviceName,
    period,
    fileName,
    pdfBase64,
    createdAt: report.createdAt,
  };
};
