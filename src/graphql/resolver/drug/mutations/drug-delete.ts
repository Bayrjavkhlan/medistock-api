import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const DrugDelete = mutationField("drugDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const drug = await ctx.prisma.drug.findUnique({ where: { id } });
    if (!drug) throw Errors.Drug.DRUG_NOT_FOUND();

    await ctx.prisma.$transaction([
      ctx.prisma.pharmacyDrug.deleteMany({ where: { drugId: id } }),
      ctx.prisma.drug.delete({ where: { id } }),
    ]);

    return true;
  },
});
