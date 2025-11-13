import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { EquipmentObjectType } from "../types";

export const EquipmentDetail = queryField("equipmentDetail", {
  type: EquipmentObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Equipment");

    const equipment = await ctx.prisma.equipment.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: { hospital: true, logs: true },
    });

    if (!equipment) return null;

    return equipment;
  },
});
