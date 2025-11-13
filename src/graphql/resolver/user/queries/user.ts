import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { UserObjectType } from "../types/object.types";

export const UserDetail = queryField("userDetail", {
  type: UserObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id,
        ...accessibleBy(ctx.caslAbility, "read", "User"),
      },
      include: { roles: true, hospital: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      hospital: user.hospital,
    };
  },
});
