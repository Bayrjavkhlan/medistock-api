// src/prisma/seed/hospitals.ts  (or wherever you keep it)

import { PrismaClient } from "@prisma/client";

export async function seedHospitals(prisma: PrismaClient) {
  console.log("Seeding hospitals + addresses...");

  const hospitalData = [
    {
      id: "hosp-1",
      name: "Central Hospital",
      phone: "70123456",
      email: "contact@centralhospital.com",
      address: {
        create: {
          id: "addr-1",
          address1: "123 Peace Avenue",
          province: "Ulaanbaatar",
        },
      },
    },
    {
      id: "hosp-2",
      name: "Northside Medical Center",
      phone: "70123457",
      email: "contact@northside.com",
      address: {
        create: {
          id: "addr-2",
          address1: "456 Freedom Street",
          address2: "Building B, Floor 2",
          province: "Ulaanbaatar",
        },
      },
    },
  ];

  const upserts = hospitalData.map((hospital) =>
    prisma.hospital.upsert({
      where: { id: hospital.id },
      update: {
        name: hospital.name,
        phone: hospital.phone,
        email: hospital.email,
        address: {
          upsert: {
            create: hospital.address.create,
            update: hospital.address.create,
          },
        },
      },
      create: hospital,
    })
  );

  await prisma.$transaction(upserts);
  console.log("Hospitals + addresses seeded perfectly!");
}