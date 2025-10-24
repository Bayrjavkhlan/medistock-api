import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles";

const prisma = new PrismaClient();

async function main() {
  console.log("1!");

  try {
    console.log("12!");

    await seedRoles();
    // await seedHospitals(prisma);
    // await seedAddresses(prisma);
    // await seedUsers(prisma);
    // await seedEquipment(prisma);
    console.log("All seed data inserted successfully!");
  } catch (e) {
    console.error("Seeding error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
