import { PrismaClient } from "@prisma/client";
import { seedHospitals } from "./hospitals";
import { seedPharmacies } from "./pharmacies";
import { seedSuppliers } from "./suppliers";
import { seedDrugs } from "./drugs";
import { seedEquipment } from "./equipment";
import { seedEquipmentLogs } from "./equipmentsLog";
import { seedSupplyItems } from "./supplyItems";
import { seedUser } from "./user";

const prisma = new PrismaClient();

async function main() {
  try {
    await seedHospitals(prisma);
    await seedPharmacies(prisma);
    await seedSuppliers(prisma);
    await seedUser(prisma);
    await seedDrugs(prisma);
    await seedEquipment(prisma);
    await seedSupplyItems(prisma);
    await seedEquipmentLogs(prisma);

    console.log("All seed data inserted successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
