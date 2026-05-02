import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const PharmacyDelete = mutationField("pharmacyDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parents, { id }, ctx) => {
    const pharmacy = await ctx.prisma.pharmacy.findUnique({
      where: { id },
    });
    if (!pharmacy) throw Errors.Pharmacy.PHARMACY_NOT_FOUND();

    await ctx.prisma.pharmacy.delete({ where: { id } });

    return true;
  },
});
