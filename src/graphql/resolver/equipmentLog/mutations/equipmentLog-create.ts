import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentLogCreateInput } from "../types";

export const EquipmentLogCreate = mutationField("equipmentLogCreate", {
  type: "Boolean",
  args: {
    input: nonNull(EquipmentLogCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { equipmentId, description } = input;

    const equipment = await ctx.prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: { hospital: { select: { organizationId: true } } },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    if (!ctx.reqUser?.user) throw Errors.Auth.NOT_AUTHORIZED();
    if (
      !ctx.reqUser.user.isPlatformAdmin &&
      (!ctx.activeOrg ||
        equipment.hospital.organizationId !== ctx.activeOrg.organization.id)
    ) {
      throw Errors.System.PERMISSION_DENIED();
    }

    await ctx.prisma.equipmentLog.create({
      data: {
        equipment: { connect: { id: equipmentId } },
        performedBy: { connect: { id: ctx.reqUser.user.id } },
        description,
      },
    });

    return true;
  },
});
