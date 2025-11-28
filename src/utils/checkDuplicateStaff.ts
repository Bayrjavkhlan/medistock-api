import { Prisma, PrismaClient, Staff } from "@prisma/client";

export async function checkDuplicateStaff(
  prisma: PrismaClient,
  email?: string,
  phone?: string
): Promise<Staff | null> {
  if (!email && !phone) return null;

  const orConditions: Prisma.StaffWhereInput[] = [
    email ? { email } : undefined,
    phone ? { phone } : undefined,
  ].filter(Boolean) as Prisma.StaffWhereInput[];

  const existingStaff = await prisma.staff.findFirst({
    where: {
      OR: orConditions,
    },
  });

  return existingStaff;
}
