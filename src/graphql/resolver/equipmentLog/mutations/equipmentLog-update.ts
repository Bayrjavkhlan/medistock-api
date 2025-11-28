import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentLogUpdateInput } from "../types";

export const EquipmentLogUpdate = mutationField("equipmentLogUpdate", {
  type: "Boolean",
  args: {
    id: nonNull("String"),
    input: nonNull(EquipmentLogUpdateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const { description } = input;

    const equipmentLog = await ctx.prisma.equipmentLog.findUnique({
      where: { id },
    });
    if (!equipmentLog) throw Errors.EquipmentLog.EQUIPMENT_NOT_FOUND();

    await ctx.prisma.equipmentLog.update({
      where: { id },
      data: {
        description: description,
        updatedBy: ctx.reqStaff?.staff?.id,
      },
    });

    return true;
  },
});
