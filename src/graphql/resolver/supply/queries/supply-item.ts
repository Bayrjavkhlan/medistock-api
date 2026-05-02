import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SupplyItemObjectType } from "../types";

export const SupplyItemDetail = queryField("supplyItemDetail", {
  type: SupplyItemObjectType,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "SupplyItem");

    return ctx.prisma.supplyItem.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: {
        supplier: {
          include: {
            organization: { include: { address: true } },
            supplyItems: true,
          },
        },
      },
    });
  },
});
