// src/prisma/seed/hospitals.ts  (or wherever you keep it)

import { OrganizationType, PrismaClient } from "@prisma/client";

export async function seedHospitals(prisma: PrismaClient) {
  console.log("Seeding organizations + hospitals + addresses...");

  const hospitalData = [
    {
      organizationId: "org-hosp-1",
      hospitalId: "hosp-1",
      name: "Central Hospital",
      phone: "70123456",
      email: "contact@centralhospital.com",
      address: {
        id: "addr-1",
        address1: "123 Peace Avenue",
        province: "Ulaanbaatar",
        latitude: 47.9186,
        longitude: 106.9177,
      },
    },
    {
      organizationId: "org-hosp-2",
      hospitalId: "hosp-2",
      name: "Northside Medical Center",
      phone: "70123457",
      email: "contact@northside.com",
      address: {
        id: "addr-2",
        address1: "456 Freedom Street",
        address2: "Building B, Floor 2",
        province: "Ulaanbaatar",
        latitude: 47.9500,
        longitude: 106.9200,
      },
    },
  ];

  const upserts = hospitalData.map((hospital) =>
    prisma.organization.upsert({
      where: { id: hospital.organizationId },
      update: {
        name: hospital.name,
        type: OrganizationType.HOSPITAL,
        hospital: {
          upsert: {
            create: {
              id: hospital.hospitalId,
              phone: hospital.phone,
              email: hospital.email,
            },
            update: {
              phone: hospital.phone,
              email: hospital.email,
            },
          },
        },
        address: {
          upsert: {
            create: hospital.address,
            update: {
              address1: hospital.address.address1,
              address2: hospital.address.address2,
              province: hospital.address.province,
              latitude: hospital.address.latitude,
              longitude: hospital.address.longitude,
            },
          },
        },
      },
      create: {
        id: hospital.organizationId,
        name: hospital.name,
        type: OrganizationType.HOSPITAL,
        hospital: {
          create: {
            id: hospital.hospitalId,
            phone: hospital.phone,
            email: hospital.email,
          },
        },
        address: {
          create: hospital.address,
        },
      },
    })
  );

  await prisma.$transaction(upserts);
  console.log("Organizations + hospitals + addresses seeded successfully!");
}
