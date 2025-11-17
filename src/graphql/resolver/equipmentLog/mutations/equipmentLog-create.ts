import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentLogCreateInput } from "../types";

export const EquipmentLogCreate = mutationField("equipmentLogCreate", {
  type: "Boolean",
  args: {
    input: nonNull(EquipmentLogCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { equipmentId, userId, description } = input;

    const equipment = await ctx.prisma.equipment.findUnique({
      where: { id: equipmentId },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw Errors.User.USER_NOT_FOUND();

    await ctx.prisma.equipmentLog.create({
      data: {
        equipment: { connect: { id: equipmentId } },
        performedBy: { connect: { id: userId } },
        description,
        createdBy: ctx.reqUser?.user?.id,
      },
    });

    return true;
  },
});
