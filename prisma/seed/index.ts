import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles";
import { seedHospitals } from "./hospitals";
import { seedAddresses } from "./address";
import { seedUsers } from "./users";
import { seedEquipment } from "./equipment";
import { seedEquipmentLogs } from "./equipmentsLog";

const prisma = new PrismaClient();

async function main() {
  try {
    await seedRoles(prisma);
    await seedHospitals(prisma);
    await seedAddresses(prisma);
    await seedUsers(prisma);
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
