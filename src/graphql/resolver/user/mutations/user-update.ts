import { arg, mutationField, nonNull, stringArg } from "nexus";
import { UserCreateInput } from "../types";
import { checkDuplicateUser } from "@/utils/checkDuplicateUser";

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
      throw new Error("User not found.");
    }

    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingUser = await checkDuplicateUser(ctx.prisma, email, phone);
    if (existingUser) {
      throw new Error("User with this email or phone already exists.");
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
        ...(hospitalId && { hospital: { connect: { id: hospitalId } } }),
      },
    });

    return true;
  },
});
