import { OrganizationType, PrismaClient } from "@prisma/client";

export async function seedPharmacies(prisma: PrismaClient) {
  console.log("Seeding organizations + pharmacies + addresses...");

  const pharmacyData = [
    {
      organizationId: "org-pharm-1",
      pharmacyId: "pharm-1",
      name: "Downtown Pharmacy",
      phone: "70123999",
      email: "contact@downtownpharmacy.com",
      address: {
        id: "addr-3",
        address1: "789 Unity Road",
        province: "Ulaanbaatar",
        latitude: 47.9500,
        longitude: 106.9200,
      },
    },
    {
      organizationId: "org-pharm-2",
      pharmacyId: "pharm-2",
      name: "Uptown Pharmacy",
      phone: "70123998",
      email: "contact@uptownpharmacy.com",
      address: {
        id: "addr-4",
        address1: "321 Liberty Avenue",
        address2: "Suite 4A",
        province: "Ulaanbaatar",
        latitude: 47.9500,
        longitude: 106.9200,
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
