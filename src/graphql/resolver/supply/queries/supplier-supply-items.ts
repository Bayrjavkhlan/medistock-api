import { intArg, nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SupplyItemsObjectType } from "../types";

export const SupplierSupplyItems = queryField("supplierSupplyItems", {
  type: SupplyItemsObjectType,
  args: {
    supplierId: nonNull(stringArg()),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, { supplierId, take, skip }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "SupplyItem");
    criteria.supplierId = supplierId;

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
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
      ctx.prisma.supplyItem.count({ where: criteria }),
    ]);

    return { data, count };
  },
});
