import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const EquipmentLogDelete = mutationField("equipmentLogDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const equipmentLog = await ctx.prisma.equipmentLog.findUnique({
      where: { id },
    });
    if (!equipmentLog) throw Errors.EquipmentLog.EQUIPMENT_NOT_FOUND();

    await ctx.prisma.equipmentLog.delete({ where: { id } });

    return true;
  },
});
