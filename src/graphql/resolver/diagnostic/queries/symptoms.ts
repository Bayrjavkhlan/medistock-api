import { queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { SymptomOptionsPayload } from "../types";

export const symptoms = queryField("symptoms", {
  type: SymptomOptionsPayload,
  resolve: async (_parent, _args, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Symptom");

    const data = await (ctx.prisma as any).symptom.findMany({
      where: criteria,
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return {
      data,
      count: data.length,
    };
  },
});
