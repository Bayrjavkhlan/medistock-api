import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, nullable, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { buildOrderBy, pagination } from "@/lib/prisma";

import { UsersObjectType, UsersOrderByInput, UsersWhereInput } from "../types";

export const Users = queryField("users", {
  type: UsersObjectType,
  args: {
    where: arg({ type: UsersWhereInput }),
    orderBy: nullable(arg({ type: UsersOrderByInput })),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, _args, ctx) => {
    const { where, orderBy, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "User");

    if (where?.roleKey) criteria.roles = { some: { key: where.roleKey } };
    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const userOrderBy = buildOrderBy<Prisma.UserOrderByWithRelationInput>({
      orderBy,
    });

    const users = await ctx.prisma.user.findMany({
      where: criteria,
      include: { hospital: true, roles: true },
      ...pagination(take, skip),
      ...userOrderBy,
    });
    return {
      data: users,
      count: users.length,
    };
  },
});
