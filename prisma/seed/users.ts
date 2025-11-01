import { PrismaClient, Prisma, EnumUserRole } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  const usersData: Prisma.UserCreateInput[] = [
    {
      id: "user-1",
      email: "admin@test.com",
      password: hashSync("A123", 10),
      name: "System Admin",
      roles: { connect: [{ key: EnumUserRole.ADMIN }] },
    },
    {
      id: "user-2",
      email: "hadmin1@test.com",
      password: hashSync("H123", 10),
      name: "Central Hospital Admin",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumUserRole.HOSPITAL_ADMIN }] },
    },
    {
      id: "user-3",
      email: "staff1@test.com",
      password: hashSync("S123", 10),
      name: "Central Staff 1",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumUserRole.STAFF }] },
    },
    {
      id: "user-4",
      email: "staff2@test.com",
      password: hashSync("S123", 10),
      name: "Northside Admin",
      hospital: { connect: { id: "hosp-2" } },
      roles: { connect: [{ key: EnumUserRole.STAFF }] },
    },
  ];

  const upsertTx = usersData.map((user) =>
    prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: user,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("Users seeded successfully.");
}
