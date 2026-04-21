import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { PharmacyDrugsObjectType, PharmacyDrugsWhereInput } from "../types";

export const PharmacyDrugs = queryField("pharmacyDrugs", {
  type: PharmacyDrugsObjectType,
  args: {
    where: arg({ type: PharmacyDrugsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const organizationId = ctx.activeOrg?.organization.id;
    if (!organizationId) throw Errors.System.PERMISSION_DENIED();

    const criteria = accessibleBy(ctx.caslAbility, "read", "PharmacyDrug");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        {
          drug: {
            is: {
              name: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
          },
        },
        {
          drug: {
            is: {
              genericName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          drug: {
            is: {
              manufacturer: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          drug: {
            is: {
              strength: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
        {
          drug: {
            is: {
              dosageForm: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      ];
    }

    const pharmacyDrugs = await ctx.prisma.pharmacyDrug.findMany({
      where: {
        ...criteria,
        pharmacy: { organizationId },
      },
      include: { drug: true },
      ...pagination(take, skip),
    });
    const count = await ctx.prisma.pharmacyDrug.count({
      where: {
        ...criteria,
        pharmacy: { organizationId },
      },
    });

    return {
      data: pharmacyDrugs,
      count,
    };
  },
});
