import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { DrugObjectType } from "../types";

export const DrugDetail = queryField("drugDetail", {
  type: DrugObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Drug");

    const drug = await ctx.prisma.drug.findFirst({
      where: {
        id,
        ...criteria,
      },
    });

    if (!drug) return null;

    return drug;
  },
});
