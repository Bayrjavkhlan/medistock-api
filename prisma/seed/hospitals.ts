import { PrismaClient, Prisma } from "@prisma/client";

export async function seedHospitals(prisma: PrismaClient) {
  console.log("Seeding hospitals...");
  const hospitalData: Prisma.HospitalCreateInput[] = [
    {
      id: "hosp-1",
      name: "Central Hospital",
      phoneNumber: "70123456",
      email: "contact@centralhospital.com",
    },
    {
      id: "hosp-2",
      name: "Northside Medical Center",
      phoneNumber: "70123457",
      email: "contact@northside.com",
    },
  ];

  const upsertTx = hospitalData.map((hospital) =>
    prisma.hospital.upsert({
      where: { id: hospital.id },
      create: hospital,
      update: hospital,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("Hospitals seeded successfully.");
}
