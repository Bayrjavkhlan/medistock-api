import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { DrugsObjectType, DrugsWhereInput } from "../types";

export const Drugs = queryField("drugs", {
  type: DrugsObjectType,
  args: {
    where: arg({ type: DrugsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "Drug");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          genericName: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
        {
          manufacturer: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          strength: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
        {
          dosageForm: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ];
    }

    const drugs = await ctx.prisma.drug.findMany({
      where: criteria,
      ...pagination(take, skip),
    });

    return {
      data: drugs,
      count: drugs.length,
    };
  },
});
