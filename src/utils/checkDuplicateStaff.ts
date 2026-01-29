import { Prisma, PrismaClient, User } from "@prisma/client";

export async function checkDuplicateUser(
  prisma: PrismaClient,
  email?: string,
  phone?: string
): Promise<User | null> {
  if (!email && !phone) return null;

  const orConditions: Prisma.UserWhereInput[] = [
    email ? { email } : undefined,
    phone ? { phone } : undefined,
  ].filter(Boolean) as Prisma.UserWhereInput[];

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: orConditions,
    },
  });

  return existingUser;
}
