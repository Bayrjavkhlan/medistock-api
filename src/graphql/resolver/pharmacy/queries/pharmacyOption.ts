import { list, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { PharmacyOptionObjectType } from "../types";

export const PharmacyOption = queryField("pharmacyOption", {
  type: nonNull(list(nonNull(PharmacyOptionObjectType))),
  resolve: async (_parents, _args, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Pharmacy");

    const pharmacies = await ctx.prisma.pharmacy.findMany({
      where: criteria,
      include: { organization: true },
      orderBy: { organization: { name: "asc" } },
    });

    return pharmacies.map((pharmacy) => ({
      id: pharmacy.id,
      name: pharmacy.organization.name,
    }));
  },
});
