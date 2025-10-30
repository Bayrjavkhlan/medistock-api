import { mutationField, nonNull } from "nexus";

import { checkDuplicateUser } from "@/utils/checkDuplicateUser";
import { generatePassword } from "@/utils/generatePassword";

export const userCreate = mutationField("userCreate", {
  type: "Boolean",
  args: {
    input: nonNull("UserCreateInput"),
  },
  resolve: async (_, { input }, ctx) => {
    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingUser = await checkDuplicateUser(ctx.prisma, email, phone);
    if (existingUser) {
      throw new Error("User with this email or phone already exists.");
    }

    const { passwordHashed } = generatePassword(email);

    await ctx.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: passwordHashed,
        roles: {
          connect: roleKeys.map((key) => ({ key })),
        },
        ...(hospitalId && { hospital: { connect: { id: hospitalId } } }),
      },
    });

    return true;
  },
});
