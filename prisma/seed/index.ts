import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles";
import { seedHospitals } from "./hospitals";
import { seedEquipment } from "./equipment";
import { seedEquipmentLogs } from "./equipmentsLog";
import { seedStaffs } from "./staff";

const prisma = new PrismaClient();

async function main() {
  try {
    await seedRoles(prisma);
    await seedHospitals(prisma);
    await seedStaffs(prisma);
    await seedEquipment(prisma);
    await seedEquipmentLogs(prisma);

    console.log("All seed data inserted successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
