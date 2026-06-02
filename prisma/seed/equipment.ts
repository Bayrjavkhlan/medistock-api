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
      name: "MRI аппарат 1",
      serialNo: "MRI-001",
      brand: "Siemens Healthineers",
      model: "MAGNETOM Aera",
      manufacturedYear: 2020,
      commissionedDate: new Date("2021-03-12"),
      endOfLifeDate: new Date("2031-03-12"),
      passportDocument: "MRI-001 паспорт.pdf",
      usageManualDocument: "MRI-001 ашиглалтын заавар.pdf",
      calibrationInstructionDocument: "MRI-001 тохируулгын заавар.pdf",
      maintenancePlan:
        "Улирал тутмын урьдчилан сэргийлэх засвар үйлчилгээ болон жил бүрийн аюулгүй ажиллагааны шалгалт.",
      requiredParts: "RF ороомгийн бүрхүүл, гелийн компрессорын шүүлтүүр",
      usedParts: "Өвчтөний ширээний бүс",
      sparePartsStock: "Шүүлтүүр бэлэн, ороомгийн бүрхүүл цөөн үлдсэн",
      category: EquipmentCategory.IMAGING_MRI,
      state: EquipmentState.AVAILABLE,
      hospital: { connect: { id: "hosp-1" } },
      assignedTo: { connect: { id: "user-3" } },
    },
    {
      id: "eq-2",
      name: "Амьсгалын аппарат A",
      serialNo: "VENT-001",
      brand: "Drager",
      model: "Evita V600",
      manufacturedYear: 2021,
      commissionedDate: new Date("2021-10-01"),
      endOfLifeDate: new Date("2030-10-01"),
      passportDocument: "VENT-001 паспорт.pdf",
      usageManualDocument: "VENT-001 ашиглалтын заавар.pdf",
      calibrationInstructionDocument: "VENT-001 тохируулгын гарын авлага.pdf",
      maintenancePlan:
        "Сар бүр хүчилтөрөгчийн мэдрэгч шалгаж, зургаан сар тутам үйлчилгээ хийх.",
      requiredParts: "Хүчилтөрөгчийн мэдрэгч, амьсгал гаргалтын хавхлага",
      usedParts: "Амьсгалын хэлхээний адаптер",
      sparePartsStock: "Хүчилтөрөгчийн мэдрэгч агуулахад байгаа",
      category: EquipmentCategory.VENTILATOR,
      state: EquipmentState.ASSIGNED,
      hospital: { connect: { id: "hosp-1" } },
      assignedTo: { connect: { id: "user-3" } },
    },
    {
      id: "eq-3",
      name: "Рентген аппарат",
      serialNo: "XRAY-001",
      brand: "GE Healthcare",
      model: "Definium 656",
      manufacturedYear: 2019,
      commissionedDate: new Date("2020-01-15"),
      endOfLifeDate: new Date("2030-01-15"),
      passportDocument: "XRAY-001 паспорт.pdf",
      usageManualDocument: "XRAY-001 ашиглалтын заавар.pdf",
      calibrationInstructionDocument: "XRAY-001 тохируулгын заавар.pdf",
      maintenancePlan:
        "Жилд хоёр удаа цацрагийн аюулгүй байдлын үзлэг болон детекторын тохируулга хийх.",
      requiredParts: "Детектор хавтангийн жийргэвч",
      usedParts: "Гуурсан хэсгийн хөргөлтийн сэнс",
      sparePartsStock: "Жийргэвч захиалгад байгаа",
      category: EquipmentCategory.IMAGING_X_RAY,
      state: EquipmentState.IN_MAINTENANCE,
      hospital: { connect: { id: "hosp-2" } },
      assignedTo: { connect: { id: "user-4" } },
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
