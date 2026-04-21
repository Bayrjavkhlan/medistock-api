import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const EquipmentDelete = mutationField("equipmentDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const equipment = await ctx.prisma.equipment.findUnique({
      where: { id },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    await ctx.prisma.$transaction([
      ctx.prisma.equipmentLog.deleteMany({ where: { equipmentId: id } }),
      ctx.prisma.equipment.delete({ where: { id } }),
    ]);

    return true;
  },
});
