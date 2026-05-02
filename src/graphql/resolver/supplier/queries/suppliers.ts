import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SuppliersObjectType, SuppliersWhereInput } from "../types";

export const Suppliers = queryField("suppliers", {
  type: SuppliersObjectType,
  args: {
    where: arg({ type: SuppliersWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, { where, take, skip }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Supplier");

    if (where?.search) {
      criteria.OR = [
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
          description: {
            contains: where.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          email: {
            contains: where.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    if (where?.status) {
      criteria.status = where.status;
    }

    const [data, count] = await Promise.all([
      ctx.prisma.supplier.findMany({
        where: criteria,
        include: {
          organization: { include: { address: true } },
          supplyItems: true,
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
      ctx.prisma.supplier.count({ where: criteria }),
    ]);

    return { data, count };
  },
});
