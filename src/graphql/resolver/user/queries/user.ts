import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { UserObjectType } from "../types";

export const UserDetail = queryField("userDetail", {
  type: UserObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "User");

    const user = await ctx.prisma.user.findFirst({
      where: {
        id,
        ...criteria,
      },
    });

    if (!user) return null;

    return user;
  },
});
