import { PrismaClient, Prisma } from "@prisma/client";

export async function seedAddresses(prisma: PrismaClient) {
  console.log("Seeding addresses...");
  const addressData: Prisma.AddressCreateInput[] = [
    {
      id: "addr-1",
      address1: "123 Peace Avenue",
      province: "Ulaanbaatar",
      hospital: { connect: { id: "hosp-1" } },
    },
    {
      id: "addr-2",
      address1: "456 Freedom Street",
      address2: "Building B, Floor 2",
      province: "Ulaanbaatar",
      hospital: { connect: { id: "hosp-2" } },
    },
  ];

  const upsertTx = addressData.map((address) =>
    prisma.address.upsert({
      where: { id: address.id },
      create: address,
      update: address,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("Addresses seeded successfully.");
}
