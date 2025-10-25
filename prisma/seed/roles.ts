import { EnumUserRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roleData: { key: EnumUserRole; name: string }[] = [
  { key: EnumUserRole.ADMIN, name: "System Administrator" },
  { key: EnumUserRole.HOSPITAL_ADMIN, name: "Hospital Administrator" },
  { key: EnumUserRole.STAFF, name: "Staff Member" },
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
