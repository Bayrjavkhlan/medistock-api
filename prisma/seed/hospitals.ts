// src/prisma/seed/hospitals.ts  (or wherever you keep it)

import { OrganizationType, PrismaClient } from "@prisma/client";

export async function seedHospitals(prisma: PrismaClient) {
  console.log("Seeding organizations + hospitals + addresses...");

  const hospitalData = [
    {
      organizationId: "org-hosp-1",
      hospitalId: "hosp-1",
      name: "Даланзадгад эмнэлэг А",
      phone: "70532001",
      email: "hospital-a@demo.mn",
      address: {
        id: "addr-1",
        address1: "Даланзадгад хотын төв",
        province: "Umnugovi, Dalanzadgad",
        latitude: 43.5772,
        longitude: 104.4254,
      },
    },
    {
      organizationId: "org-hosp-2",
      hospitalId: "hosp-2",
      name: "Даланзадгад эмнэлэг Б",
      phone: "70532002",
      email: "hospital-b@demo.mn",
      address: {
        id: "addr-2",
        address1: "Даланзадгадын урд хэсэг",
        address2: "Аймгийн төвийн ойролцоо",
        province: "Umnugovi, Dalanzadgad",
        latitude: 43.5748,
        longitude: 104.4291,
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
