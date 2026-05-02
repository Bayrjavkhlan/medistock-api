import { OrganizationType, PrismaClient } from "@prisma/client";

export async function seedPharmacies(prisma: PrismaClient) {
  console.log("Seeding organizations + pharmacies + addresses...");

  const pharmacyData = [
    {
      organizationId: "org-pharm-1",
      pharmacyId: "pharm-1",
      name: "Улаанбаатар эмийн сан А",
      phone: "70533001",
      email: "pharmacy-a@demo.mn",
      address: {
        id: "addr-3",
        address1: "Баянгол дүүрэг, 3-р хороо",
        province: "Улаанбаатар",
        latitude: 47.9013,
        longitude: 106.912,
      },
    },
    {
      organizationId: "org-pharm-2",
      pharmacyId: "pharm-2",
      name: "Улаанбаатар эмийн сан Б",
      phone: "70533002",
      email: "pharmacy-b@demo.mn",
      address: {
        id: "addr-4",
        address1: "Хан-Уул дүүрэг, 15-р хороо",
        address2: "Наадамчдын зам",
        province: "Улаанбаатар",
        latitude: 47.8864,
        longitude: 106.9057,
      },
    },
    {
      organizationId: "org-pharm-3",
      pharmacyId: "pharm-3",
      name: "Улаанбаатар эмийн сан В",
      phone: "70533003",
      email: "pharmacy-c@demo.mn",
      address: {
        id: "addr-5",
        address1: "Сонгинохайрхан дүүрэг, 18-р хороо",
        address2: "Үйлдвэрчний тойрог",
        province: "Улаанбаатар",
        latitude: 47.92123,
        longitude: 106.918556,
      },
    },
  ];

  const upserts = pharmacyData.map((pharmacy) =>
    prisma.organization.upsert({
      where: { id: pharmacy.organizationId },
      update: {
        name: pharmacy.name,
        type: OrganizationType.PHARMACY,
        pharmacy: {
          upsert: {
            create: {
              id: pharmacy.pharmacyId,
              phone: pharmacy.phone,
              email: pharmacy.email,
            },
            update: {
              phone: pharmacy.phone,
              email: pharmacy.email,
            },
          },
        },
        address: {
          upsert: {
            create: pharmacy.address,
            update: {
              address1: pharmacy.address.address1,
              address2: pharmacy.address.address2,
              province: pharmacy.address.province,
              latitude: pharmacy.address.latitude,
              longitude: pharmacy.address.longitude,
            },
          },
        },
      },
      create: {
        id: pharmacy.organizationId,
        name: pharmacy.name,
        type: OrganizationType.PHARMACY,
        pharmacy: {
          create: {
            id: pharmacy.pharmacyId,
            phone: pharmacy.phone,
            email: pharmacy.email,
          },
        },
        address: {
          create: pharmacy.address,
        },
      },
    }),
  );

  await prisma.$transaction(upserts);
  console.log("Organizations + pharmacies + addresses seeded successfully!");
}
