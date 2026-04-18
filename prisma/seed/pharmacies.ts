import { OrganizationType, PrismaClient } from "@prisma/client";

export async function seedPharmacies(prisma: PrismaClient) {
  console.log("Seeding organizations + pharmacies + addresses...");

  const pharmacyData = [
    {
      organizationId: "org-pharm-1",
      pharmacyId: "pharm-1",
      name: "Даланзадгад эмийн сан А",
      phone: "70533001",
      email: "pharmacy-a@demo.mn",
      address: {
        id: "addr-3",
        address1: "Төв захын орчим",
        province: "Umnugovi, Dalanzadgad",
        latitude: 43.5764,
        longitude: 104.4236,
      },
    },
    {
      organizationId: "org-pharm-2",
      pharmacyId: "pharm-2",
      name: "Даланзадгад эмийн сан Б",
      phone: "70533002",
      email: "pharmacy-b@demo.mn",
      address: {
        id: "addr-4",
        address1: "Даланзадгадын зүүн хэсэг",
        address2: "Худалдааны гудамж",
        province: "Umnugovi, Dalanzadgad",
        latitude: 43.5786,
        longitude: 104.4312,
      },
    },
    {
      organizationId: "org-pharm-3",
      pharmacyId: "pharm-3",
      name: "Даланзадгад эмийн сан В",
      phone: "70533003",
      email: "pharmacy-c@demo.mn",
      address: {
        id: "addr-5",
        address1: "Даланзадгадын баруун хэсэг",
        address2: "Орон сууцны бүс",
        province: "Umnugovi, Dalanzadgad",
        latitude: 43.5751,
        longitude: 104.4198,
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
    })
  );

  await prisma.$transaction(upserts);
  console.log("Organizations + pharmacies + addresses seeded successfully!");
}
