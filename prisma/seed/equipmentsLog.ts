import { PrismaClient, Prisma } from "@prisma/client";

export async function seedEquipmentLogs(prisma: PrismaClient) {
  console.log("Seeding equipment logs...");

  // Fixed IDs for seeding
  const equipmentLogData: Prisma.EquipmentLogCreateInput[] = [
    {
      id: "log-1",
      equipment: { connect: { id: "eq-1" } },
      performedBy: { connect: { id: "user-1" } },
      description: "Initial log entry for equipment eq-1",
      createdBy: "system",
      updatedBy: "system",
    },
    {
      id: "log-2",
      equipment: { connect: { id: "eq-2" } },
      performedBy: { connect: { id: "user-2" } },
      description: "Initial log entry for equipment eq-2",
      createdBy: "system",
      updatedBy: "system",
    },
    {
      id: "log-3",
      equipment: { connect: { id: "eq-3" } },
      performedBy: { connect: { id: "user-3" } },
      description: "Initial log entry for equipment eq-3",
      createdBy: "system",
      updatedBy: "system",
    },
    {
      id: "log-3",
      equipment: { connect: { id: "eq-2" } },
      performedBy: { connect: { id: "user-1" } },
      description: "Second log entry for equipment eq-2",
      createdBy: "system",
      updatedBy: "system",
    },
  ];

  const upsertTx = equipmentLogData.map((log) =>
    prisma.equipmentLog.upsert({
      where: { id: log.id },
      create: log,
      update: log,
    })
  );

  try {
    await prisma.$transaction(upsertTx);
    console.log("Equipment logs seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}
