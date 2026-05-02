import { hashSync } from "bcrypt";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { UserUpdateInput } from "../types";

export const UserUpdate = mutationField("userUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(UserUpdateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const {
      email,
      phone,
      name,
      password,
      isPlatformAdmin,
      organizationId,
      role,
    } = input;

    const user = await ctx.prisma.user.findUnique({ where: { id } });
    if (!user) throw Errors.User.USER_NOT_FOUND();

    if (email || phone) {
      const existing = await ctx.prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
        },
      });
      if (existing) throw Errors.User.DUPLICATE_USER();
    }

    if (organizationId && !role) throw Errors.User.ROLE_REQUIRED();
    if (role && !organizationId) throw Errors.User.ROLE_REQUIRED();
    if (organizationId) {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: organizationId },
      });
      if (!organization) throw Errors.System.DATA_NOT_FOUND();
    }

    const updateUser = ctx.prisma.user.update({
      where: { id },
      data: {
        email,
        phone,
        name,
        password: password ? hashSync(password, 10) : undefined,
        isPlatformAdmin: isPlatformAdmin ?? undefined,
      },
    });

    const upsertMembership =
      organizationId && role
        ? ctx.prisma.membership.upsert({
            where: {
              userId_organizationId: {
                userId: id,
                organizationId,
              },
            },
            create: {
              userId: id,
              organizationId,
              role,
            },
            update: {
              role,
            },
          })
        : undefined;

    if (upsertMembership) {
      await ctx.prisma.$transaction([updateUser, upsertMembership]);
    } else {
      await updateUser;
    }

    return true;
  },
});
