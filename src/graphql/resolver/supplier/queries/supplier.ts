import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SupplierObjectType } from "../types";

export const SupplierDetail = queryField("supplierDetail", {
  type: SupplierObjectType,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Supplier");

    return ctx.prisma.supplier.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: {
        organization: { include: { address: true } },
        supplyItems: {
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        },
      },
    });
  },
});
