import { PrismaClient } from "@prisma/client";

export async function checkDuplicateUser(
  prisma: PrismaClient,
  email?: string,
  phone?: string
) {
  if (!email && !phone) return null;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(
        Boolean
      ) as any[],
    },
  });

  return existingUser;
}
