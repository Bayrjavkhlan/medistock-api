import {
  InventoryStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export async function seedDrugs(prisma: PrismaClient) {
  console.log("Seeding drugs + pharmacy inventory...");

  const drugsData: Prisma.DrugCreateInput[] = [
    {
      id: "drug-1",
      name: "Paracetamol",
      genericName: "Acetaminophen",
      dosageForm: "Tablet",
      strength: "500mg",
      manufacturer: "MediPharm",
      description: "Pain and fever relief.",
    },
    {
      id: "drug-2",
      name: "Amoxicillin",
      dosageForm: "Capsule",
      strength: "500mg",
      manufacturer: "HealthCore",
      description: "Antibiotic for bacterial infections.",
    },
    {
      id: "drug-3",
      name: "Ibuprofen",
      dosageForm: "Tablet",
      strength: "200mg",
      manufacturer: "CureLabs",
      description: "Anti-inflammatory pain relief.",
    },
    {
      id: "drug-4",
      name: "Omeprazole",
      dosageForm: "Capsule",
      strength: "20mg",
      manufacturer: "DigestWell",
      description: "Reduces stomach acid.",
    },
  ];

  const drugUpserts = drugsData.map((drug) =>
    prisma.drug.upsert({
      where: {
        name_strength_dosageForm: {
          name: drug.name,
          strength: drug.strength ?? "",
          dosageForm: drug.dosageForm ?? "",
        },
      },
      create: drug,
      update: {
        genericName: drug.genericName,
        manufacturer: drug.manufacturer,
        description: drug.description,
      },
    })
  );

  await prisma.$transaction(drugUpserts);

  const inventoryData = [
    {
      id: "inv-1",
      pharmacyId: "pharm-1",
      drugId: "drug-1",
      quantity: 120,
      price: 1.2,
      status: InventoryStatus.AVAILABLE,
    },
    {
      id: "inv-2",
      pharmacyId: "pharm-1",
      drugId: "drug-2",
      quantity: 40,
      price: 3.5,
      status: InventoryStatus.LOW,
    },
    {
      id: "inv-3",
      pharmacyId: "pharm-2",
      drugId: "drug-3",
      quantity: 200,
      price: 1.0,
      status: InventoryStatus.AVAILABLE,
    },
    {
      id: "inv-4",
      pharmacyId: "pharm-2",
      drugId: "drug-4",
      quantity: 0,
      price: 4.5,
      status: InventoryStatus.OUT_OF_STOCK,
    },
  ];

  const inventoryUpserts = inventoryData.map((item) =>
    prisma.pharmacyDrug.upsert({
      where: {
        pharmacyId_drugId: {
          pharmacyId: item.pharmacyId,
          drugId: item.drugId,
        },
      },
      create: item,
      update: {
        quantity: item.quantity,
        price: item.price,
        status: item.status,
      },
    })
  );

  await prisma.$transaction(inventoryUpserts);
  console.log("Drugs + pharmacy inventory seeded successfully!");
}
