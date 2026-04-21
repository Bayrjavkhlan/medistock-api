import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { PharmacyObjectType } from "../types";

export const PharmacyDetail = queryField("pharmacyDetail", {
  type: PharmacyObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Pharmacy");

    const pharmacy = await ctx.prisma.pharmacy.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: {
        organization: { include: { address: true } },
        inventory: {
          include: { drug: true },
          orderBy: [{ updatedAt: "desc" }, { quantity: "desc" }],
        },
      },
    });

    if (!pharmacy) return null;

    return pharmacy;
  },
});
