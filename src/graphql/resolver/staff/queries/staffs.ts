import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, nullable, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { buildOrderBy, pagination } from "@/lib/prisma";

import {
  StaffsObjectType,
  StaffsOrderByInput,
  StaffsWhereInput,
} from "../types";

export const Staffs = queryField("staffs", {
  type: StaffsObjectType,
  args: {
    where: arg({ type: StaffsWhereInput }),
    orderBy: nullable(arg({ type: StaffsOrderByInput })),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, _args, ctx) => {
    const { where, orderBy, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "Staff");

    if (where?.roleKey) criteria.roles = { some: { key: where.roleKey } };
    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const staffOrderBy = buildOrderBy<Prisma.StaffOrderByWithRelationInput>({
      orderBy,
    });

    const staffs = await ctx.prisma.staff.findMany({
      where: criteria,
      include: { hospital: true, roles: true },
      ...pagination(take, skip),
      ...staffOrderBy,
    });
    return {
      data: staffs,
      count: staffs.length,
    };
  },
});
