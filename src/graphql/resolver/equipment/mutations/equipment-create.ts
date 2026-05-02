import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentCreateInput } from "../types";

export const EquipmentCreate = mutationField("equipmentCreate", {
  type: "Boolean",
  args: {
    input: nonNull(EquipmentCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { name, serialNo, hospitalId, assignedToId, category, state } = input;

    const hospital = await ctx.prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: { organization: true },
    });
    if (!hospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();

    if (!ctx.reqUser?.user) throw Errors.Auth.NOT_AUTHORIZED();

    if (
      !ctx.reqUser.user.isPlatformAdmin &&
      (!ctx.activeOrg ||
        ctx.activeOrg.organization.id !== hospital.organizationId)
    ) {
      throw Errors.System.PERMISSION_DENIED();
    }

    if (assignedToId) {
      const membership = await ctx.prisma.membership.findFirst({
        where: {
          userId: assignedToId,
          organizationId: hospital.organizationId,
        },
      });
      if (!membership) throw Errors.System.PERMISSION_DENIED();
    }

    const existing = await ctx.prisma.equipment.findUnique({
      where: { serialNo },
    });
    if (existing) throw Errors.Equipment.DUPLICATE_EQUIPMENT_SERIAL_NUMBER();

    await ctx.prisma.equipment.create({
      data: {
        name,
        serialNo,
        category,
        state,
        hospital: { connect: { id: hospitalId } },
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
    });

    return true;
  },
});
