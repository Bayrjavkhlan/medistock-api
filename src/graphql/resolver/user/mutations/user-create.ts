import { hashSync } from "bcrypt";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { UserCreateInput } from "../types";

export const UserCreate = mutationField("userCreate", {
  type: "Boolean",
  args: {
    input: nonNull(UserCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const {
      email,
      phone,
      name,
      password,
      isPlatformAdmin,
      organizationId,
      role,
    } = input;

    const existing = await ctx.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });
    if (existing) throw Errors.User.DUPLICATE_USER();

    if (organizationId && !role) throw Errors.User.ROLE_REQUIRED();
    if (organizationId) {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: organizationId },
      });
      if (!organization) throw Errors.System.DATA_NOT_FOUND();
    }

    const membershipData =
      organizationId && role ? { organizationId, role } : undefined;

    await ctx.prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashSync(password, 10),
        isPlatformAdmin: Boolean(isPlatformAdmin),
        memberships: membershipData
          ? {
              create: membershipData,
            }
          : undefined,
      },
    });

    return true;
  },
});
