import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { UsersObjectType, UsersWhereInput } from "../types";

export const Users = queryField("users", {
  type: UsersObjectType,
  args: {
    where: arg({ type: UsersWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "User");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (where?.organizationId) {
      criteria.memberships = {
        some: { organizationId: where.organizationId },
      };
    }

    const users = await ctx.prisma.user.findMany({
      where: criteria,
      ...pagination(take, skip),
    });

    return {
      data: users,
      count: users.length,
    };
  },
});
