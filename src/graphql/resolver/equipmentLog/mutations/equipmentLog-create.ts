import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentLogCreateInput } from "../types";

export const EquipmentLogCreate = mutationField("equipmentLogCreate", {
  type: "Boolean",
  args: {
    input: nonNull(EquipmentLogCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { equipmentId, staffId, description } = input;

    const equipment = await ctx.prisma.equipment.findUnique({
      where: { id: equipmentId },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    const staff = await ctx.prisma.staff.findUnique({
      where: { id: staffId },
    });
    if (!staff) throw Errors.Staff.STAFF_NOT_FOUND();

    await ctx.prisma.equipmentLog.create({
      data: {
        equipment: { connect: { id: equipmentId } },
        performedBy: { connect: { id: staffId } },
        description,
        createdBy: ctx.reqStaff?.staff?.id,
      },
    });

    return true;
  },
});
