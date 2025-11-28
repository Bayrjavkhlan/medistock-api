import { EnumStaffRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleData: { key: EnumStaffRole; name: string }[] = [
  { key: EnumStaffRole.ADMIN, name: "System Administrator" },
  { key: EnumStaffRole.HOSPITAL_ADMIN, name: "Hospital Administrator" },
  { key: EnumStaffRole.STAFF, name: "Staff Member" },
];

export const seedRoles = async (prisma: PrismaClient) => {
  const upsertTx = roleData.map((role) =>
    prisma.role.upsert({
      where: { key: role.key },
      create: role,
      update: role,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("Roles seeded successfully!");
};
