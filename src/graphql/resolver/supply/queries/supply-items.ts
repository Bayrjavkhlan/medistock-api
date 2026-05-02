import { Prisma } from "@prisma/client";
import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SupplyItemsObjectType, SupplyItemsWhereInput } from "../types";

const buildOrderBy = (where?: {
  sortBy?: "NAME" | "PRICE" | "UPDATED_AT" | "CREATED_AT" | null;
  sortOrder?: "asc" | "desc" | null;
}) => {
  const sortOrder = where?.sortOrder ?? "desc";

  switch (where?.sortBy) {
    case "NAME":
      return [{ name: "asc" as const }];
    case "PRICE":
      return [{ price: sortOrder }];
    case "CREATED_AT":
      return [{ createdAt: sortOrder }];
    case "UPDATED_AT":
    default:
      return [{ updatedAt: sortOrder }, { createdAt: "desc" as const }];
  }
};

export const SupplyItems = queryField("supplyItems", {
  type: SupplyItemsObjectType,
  args: {
    where: arg({ type: SupplyItemsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, { where, take, skip }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "SupplyItem");

    if (where?.search) {
      criteria.OR = [
        {
          name: {
            contains: where.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          shortDescription: {
            contains: where.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: where.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          supplier: {
            is: {
              organization: {
                is: {
                  name: {
                    contains: where.search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (where?.supplierId) criteria.supplierId = where.supplierId;
    if (where?.category) criteria.category = where.category;
    if (where?.availability) criteria.availability = where.availability;
    if (where?.minPrice != null || where?.maxPrice != null) {
      criteria.price = {
        gte: where?.minPrice ?? undefined,
        lte: where?.maxPrice ?? undefined,
      };
    }

    const [data, count] = await Promise.all([
      ctx.prisma.supplyItem.findMany({
        where: criteria,
        include: {
          supplier: {
            include: {
              organization: { include: { address: true } },
              supplyItems: true,
            },
          },
        },
        orderBy: buildOrderBy(where ?? undefined),
        skip,
        take,
      }),
      ctx.prisma.supplyItem.count({ where: criteria }),
    ]);

    return { data, count };
  },
});
