import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
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
      throw Errors.User.DUPLICATED_USER_EMAIL();
    }

    const { password, passwordHashed } = generatePassword(email);

    console.log("password:\t", password);

    await ctx.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: passwordHashed,
        roles: {
          connect: roleKeys.map((key) => ({ key })),
        },
        ...(hospitalId && {
          hospital: { connect: { id: hospitalId } },
        }),
      },
    });

    return true;
  },
});
