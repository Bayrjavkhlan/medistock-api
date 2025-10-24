import {
  PrismaClient,
  Prisma,
  EquipmentCategory,
  EquipmentState,
} from "@prisma/client";

export async function seedEquipment(prisma: PrismaClient) {
  console.log("Seeding equipment...");

  const equipmentData: Prisma.EquipmentCreateInput[] = [
    {
      id: "eq-1",
      name: "MRI Scanner 1",
      serialNo: "MRI-001",
      category: EquipmentCategory.IMAGING_MRI,
      state: EquipmentState.AVAILABLE,
      hospital: { connect: { id: "hosp-1" } },
    },
    {
      id: "eq-2",
      name: "Ventilator A",
      serialNo: "VENT-001",
      category: EquipmentCategory.VENTILATOR,
      state: EquipmentState.ASSIGNED,
      hospital: { connect: { id: "hosp-1" } },
      assignedTo: { connect: { email: "hospital1.staff1@central.com" } },
    },
    {
      id: "eq-3",
      name: "X-Ray Machine",
      serialNo: "XRAY-001",
      category: EquipmentCategory.IMAGING_X_RAY,
      state: EquipmentState.IN_MAINTENANCE,
      hospital: { connect: { id: "hosp-2" } },
    },
  ];

  const upsertTx = equipmentData.map((equipment) =>
    prisma.equipment.upsert({
      where: { id: equipment.id },
      create: equipment,
      update: equipment,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("Equipment seeded successfully.");
}
