import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { EquipmentLogObjectType } from "../types";

export const EquipmentLogDetail = queryField("equipmentLogDetail", {
  type: EquipmentLogObjectType,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "EquipmentLog");

    const equipmentLog = await ctx.prisma.equipmentLog.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: {
        equipment: {
          include: {
            hospital: true,
          },
        },
        performedBy: true,
      },
    });

    if (!equipmentLog) return null;

    return equipmentLog;
  },
});
