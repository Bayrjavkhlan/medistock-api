import { PrismaClient, Prisma } from "@prisma/client";

export async function seedHospitals(prisma: PrismaClient) {
  console.log("Seeding hospitals...");

  const hospitalData: Prisma.HospitalCreateInput[] = [
    {
      id: "hosp-1",
      name: "Central Hospital",
      phoneNumber: "70123456",
      email: "contact@centralhospital.com",
      address: {
        create: {
          address1: "123 Main St",
          address2: "Building A",
          province: "Ulaanbaatar",
        },
      },
    },
    {
      id: "hosp-2",
      name: "Northside Medical Center",
      phoneNumber: "70123457",
      email: "contact@northside.com",
      address: {
        create: {
          address1: "456 North Ave",
          address2: null,
          province: "Ulaanbaatar",
        },
      },
    },
  ];

  try {
    const upsertTx = hospitalData.map((hospital) =>
      prisma.hospital.upsert({
        where: { id: hospital.id },
        create: hospital,
        update: {
          name: hospital.name,
          phoneNumber: hospital.phoneNumber,
          email: hospital.email,
          address: {
            upsert: {
              create: hospital.address!.create!,
              update: hospital.address!.create!,
            },
          },
        },
      })
    );

    await prisma.$transaction(upsertTx);
    console.log("Hospitals seeded successfully!");
  } catch (error) {
    console.error("Error seeding hospitals:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run independently
