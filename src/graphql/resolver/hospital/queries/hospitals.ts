import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { HospitalsObjectType, HospitalsWhereInput } from "../types";

export const Hospitals = queryField("hospitals", {
  type: HospitalsObjectType,
  args: {
    where: arg({ type: HospitalsWhereInput }),
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

      const hospitals = await ctx.prisma.hospital.findMany({
        where: adminWhere,
        include: { organization: { include: { address: true } } },
        ...pagination(take, skip),
      });
      const count = await ctx.prisma.hospital.count({
        where: adminWhere,
      });

      return {
        data: hospitals,
        count,
      };
    }

    const criteria = accessibleBy(ctx.caslAbility, "read", "Hospital");

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
    if (where?.address) {
      // todo filter by address
    }
    const hospitals = await ctx.prisma.hospital.findMany({
      where: criteria,
      include: { organization: { include: { address: true } } },
      ...pagination(take, skip),
    });
    const count = await ctx.prisma.hospital.count({
      where: criteria,
    });
    return {
      data: hospitals,
      count,
    };
  },
});
