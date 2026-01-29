import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { DrugCreateInput } from "../types";

export const DrugUpdate = mutationField("drugUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(DrugCreateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const {
      name,
      genericName,
      dosageForm,
      strength,
      manufacturer,
      description,
    } = input;

    const drug = await ctx.prisma.drug.findUnique({ where: { id } });
    if (!drug) throw Errors.Drug.DRUG_NOT_FOUND();

    const existing = await ctx.prisma.drug.findFirst({
      where: {
        id: { not: id },
        name,
        strength: strength ?? null,
        dosageForm: dosageForm ?? null,
      },
    });
    if (existing) throw Errors.Drug.DUPLICATE_DRUG();

    await ctx.prisma.drug.update({
      where: { id },
      data: {
        name,
        genericName,
        dosageForm,
        strength,
        manufacturer,
        description,
      },
    });

    return true;
  },
});
