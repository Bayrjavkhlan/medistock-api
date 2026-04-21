import { OrganizationRole, Prisma, PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";

export async function seedUser(prisma: PrismaClient) {
  console.log("Seeding users + memberships...");

  const usersData: Prisma.UserCreateInput[] = [
    {
      id: "user-0",
      email: "owner@system.local",
      password: hashSync("Owner123", 10),
      name: "System Owner",
      phone: "00000000",
      isPlatformAdmin: true,
      emailVerified: true,
    },
    {
      id: "user-1",
      email: "admin@test.com",
      password: hashSync("A123", 10),
      name: "System Admin",
      phone: "00000001",
      isPlatformAdmin: true,
      emailVerified: true,
    },
    {
      id: "user-1a",
      email: "hosp1.owner@test.com",
      password: hashSync("H123", 10),
      name: "Даланзадгад эмнэлэг А эзэн",
      phone: "00000011",
      emailVerified: true,
    },
    {
      id: "user-2",
      email: "hadmin1@test.com",
      password: hashSync("H123", 10),
      name: "Даланзадгад эмнэлэг А менежер",
      phone: "00000002",
      emailVerified: true,
    },
    {
      id: "user-3",
      email: "staff1@test.com",
      password: hashSync("S123", 10),
      name: "Даланзадгад эмнэлэг А ажилтан",
      phone: "00000003",
      emailVerified: true,
    },
    {
      id: "user-4a",
      email: "hosp2.owner@test.com",
      password: hashSync("H123", 10),
      name: "Даланзадгад эмнэлэг Б эзэн",
      phone: "00000021",
      emailVerified: true,
    },
    {
      id: "user-4b",
      email: "hosp2.manager@test.com",
      password: hashSync("H123", 10),
      name: "Даланзадгад эмнэлэг Б менежер",
      phone: "00000022",
      emailVerified: true,
    },
    {
      id: "user-4",
      email: "staff2@test.com",
      password: hashSync("S123", 10),
      name: "Даланзадгад эмнэлэг Б ажилтан",
      phone: "00000004",
      emailVerified: true,
    },
    {
      id: "user-5",
      email: "pharm1.owner@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан А эзэн",
      phone: "00000031",
      emailVerified: true,
    },
    {
      id: "user-6",
      email: "pharm1.manager@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан А менежер",
      phone: "00000032",
      emailVerified: true,
    },
    {
      id: "user-7",
      email: "pharm1.staff@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан А ажилтан",
      phone: "00000033",
      emailVerified: true,
    },
    {
      id: "user-8",
      email: "pharm2.owner@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан Б эзэн",
      phone: "00000041",
      emailVerified: true,
    },
    {
      id: "user-9",
      email: "pharm2.manager@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан Б менежер",
      phone: "00000042",
      emailVerified: true,
    },
    {
      id: "user-10",
      email: "pharm2.staff@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан Б ажилтан",
      phone: "00000043",
      emailVerified: true,
    },
    {
      id: "user-11",
      email: "pharm3.owner@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан В эзэн",
      phone: "00000051",
      emailVerified: true,
    },
    {
      id: "user-12",
      email: "pharm3.manager@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан В менежер",
      phone: "00000052",
      emailVerified: true,
    },
    {
      id: "user-13",
      email: "pharm3.staff@test.com",
      password: hashSync("P123", 10),
      name: "Даланзадгад эмийн сан В ажилтан",
      phone: "00000053",
      emailVerified: true,
    },
  ];

  const userUpserts = usersData.map((user) =>
    prisma.user.upsert({
      where: { email: user.email ?? "" },
      create: user,
      update: {
        name: user.name,
        phone: user.phone,
        password: user.password,
        isPlatformAdmin: user.isPlatformAdmin,
        emailVerified: true,
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
        otpLastSentAt: null,
      },
    })
  );

  await prisma.$transaction(userUpserts);

  const memberships = [
    {
      id: "mship-0",
      userId: "user-1a",
      organizationId: "org-hosp-1",
      role: OrganizationRole.OWNER,
    },
    {
      id: "mship-1",
      userId: "user-2",
      organizationId: "org-hosp-1",
      role: OrganizationRole.MANAGER,
    },
    {
      id: "mship-2",
      userId: "user-3",
      organizationId: "org-hosp-1",
      role: OrganizationRole.STAFF,
    },
    {
      id: "mship-3",
      userId: "user-4a",
      organizationId: "org-hosp-2",
      role: OrganizationRole.OWNER,
    },
    {
      id: "mship-4",
      userId: "user-4b",
      organizationId: "org-hosp-2",
      role: OrganizationRole.MANAGER,
    },
    {
      id: "mship-5",
      userId: "user-4",
      organizationId: "org-hosp-2",
      role: OrganizationRole.STAFF,
    },
    {
      id: "mship-6",
      userId: "user-5",
      organizationId: "org-pharm-1",
      role: OrganizationRole.OWNER,
    },
    {
      id: "mship-7",
      userId: "user-6",
      organizationId: "org-pharm-1",
      role: OrganizationRole.MANAGER,
    },
    {
      id: "mship-8",
      userId: "user-7",
      organizationId: "org-pharm-1",
      role: OrganizationRole.STAFF,
    },
    {
      id: "mship-9",
      userId: "user-8",
      organizationId: "org-pharm-2",
      role: OrganizationRole.OWNER,
    },
    {
      id: "mship-10",
      userId: "user-9",
      organizationId: "org-pharm-2",
      role: OrganizationRole.MANAGER,
    },
    {
      id: "mship-11",
      userId: "user-10",
      organizationId: "org-pharm-2",
      role: OrganizationRole.STAFF,
    },
    {
      id: "mship-12",
      userId: "user-11",
      organizationId: "org-pharm-3",
      role: OrganizationRole.OWNER,
    },
    {
      id: "mship-13",
      userId: "user-12",
      organizationId: "org-pharm-3",
      role: OrganizationRole.MANAGER,
    },
    {
      id: "mship-14",
      userId: "user-13",
      organizationId: "org-pharm-3",
      role: OrganizationRole.STAFF,
    },
  ];

  const membershipUpserts = memberships.map((membership) =>
    prisma.membership.upsert({
      where: {
        userId_organizationId: {
          userId: membership.userId,
          organizationId: membership.organizationId,
        },
      },
      create: membership,
      update: { role: membership.role },
    })
  );

  await prisma.$transaction(membershipUpserts);
  console.log("Users + memberships seeded successfully.");
}
