import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { DrugCreateInput } from "../types";

export const DrugCreate = mutationField("drugCreate", {
  type: "Boolean",
  args: {
    input: nonNull(DrugCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const {
      name,
      genericName,
      dosageForm,
      strength,
      manufacturer,
      description,
    } = input;

    const existing = await ctx.prisma.drug.findFirst({
      where: {
        name,
        strength: strength ?? null,
        dosageForm: dosageForm ?? null,
      },
    });
    if (existing) throw Errors.Drug.DUPLICATE_DRUG();

    await ctx.prisma.drug.create({
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
