import { arg, mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { checkDuplicateUser } from "@/utils/checkDuplicateUser";

import { UserCreateInput } from "../types";

export const UserUpdate = mutationField("userUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(arg({ type: UserCreateInput })),
  },
  resolve: async (_, { id, input }, ctx) => {
    const user = await ctx.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw Errors.User.USER_NOT_FOUND;
    }

    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingUser = await checkDuplicateUser(ctx.prisma, email, phone);
    if (existingUser) {
      throw Errors.User.DUPLICATED_USER_EMAIL();
    }

    await ctx.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        roles: {
          set: [],
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
