import { PrismaClient, Prisma, EnumUserRole } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  const usersData: Prisma.UserCreateInput[] = [
    {
      email: "admin@system.com",
      password: "password123",
      name: "System Admin",
      roles: { connect: [{ key: EnumUserRole.ADMIN }] },
    },
    {
      email: "hospital1.admin@central.com",
      password: "password123",
      name: "Central Hospital Admin",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumUserRole.ADMIN }] },
    },
    {
      email: "hospital1.staff1@central.com",
      password: "password123",
      name: "Central Staff 1",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumUserRole.STAFF }] },
    },
    {
      email: "hospital2.admin@northside.com",
      password: "password123",
      name: "Northside Admin",
      hospital: { connect: { id: "hosp-2" } },
      roles: { connect: [{ key: EnumUserRole.HOSPITAL_ADMIN }] },
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
