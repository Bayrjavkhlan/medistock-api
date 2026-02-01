import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { PharmaciesObjectType, PharmaciesWhereInput } from "../types";

export const Pharmacies = queryField("pharmacies", {
  type: PharmaciesObjectType,
  args: {
    where: arg({ type: PharmaciesWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    if (ctx.reqUser?.user?.isPlatformAdmin) {
      const adminWhere = where?.search
        ? {
            OR: [
              {
                organization: {
                  is: {
                    name: {
                      contains: where.search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
              {
                email: {
                  contains: where.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                phone: {
                  contains: where.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : undefined;

      const pharmacies = await ctx.prisma.pharmacy.findMany({
        where: adminWhere,
        include: { organization: { include: { address: true } } },
        ...pagination(take, skip),
      });

      return {
        data: pharmacies,
        count: pharmacies.length,
      };
    }

    const criteria = accessibleBy(ctx.caslAbility, "read", "Pharmacy");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        {
          organization: {
            is: { name: { contains: search, mode: "insensitive" } },
          },
        },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const pharmacies = await ctx.prisma.pharmacy.findMany({
      where: criteria,
      include: { organization: { include: { address: true } } },
      ...pagination(take, skip),
    });

    return {
      data: pharmacies,
      count: pharmacies.length,
    };
  },
});
