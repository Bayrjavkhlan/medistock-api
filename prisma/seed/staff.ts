import { PrismaClient, Prisma, EnumStaffRole } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function seedStaffs(prisma: PrismaClient) {
  console.log("Seeding staffs...");

  const staffsData: Prisma.StaffCreateInput[] = [
    {
      id: "staff-1",
      email: "admin@test.com",
      password: hashSync("A123", 10),
      name: "System Admin",
      phone: "00000001",
      roles: { connect: [{ key: EnumStaffRole.ADMIN }] },
    },
    {
      id: "staff-2",
      email: "hadmin1@test.com",
      password: hashSync("H123", 10),
      name: "Central Hospital Admin",
      phone: "00000002",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumStaffRole.HOSPITAL_ADMIN }] },
    },
    {
      id: "staff-3",
      email: "staff1@test.com",
      password: hashSync("S123", 10),
      name: "Central Staff 1",
      phone: "00000003",
      hospital: { connect: { id: "hosp-1" } },
      roles: { connect: [{ key: EnumStaffRole.STAFF }] },
    },
    {
      id: "staff-4",
      email: "staff2@test.com",
      password: hashSync("S123", 10),
      name: "Northside Admin",
      phone: "00000004",
      hospital: { connect: { id: "hosp-2" } },
      roles: { connect: [{ key: EnumStaffRole.STAFF }] },
    },
  ];

  const upsertTx = staffsData.map((staff) =>
    prisma.staff.upsert({
      where: { email: staff.email },
      create: staff,
      update: staff,
    })
  );

  await prisma.$transaction(upsertTx);
  console.log("staffs seeded successfully.");
}
