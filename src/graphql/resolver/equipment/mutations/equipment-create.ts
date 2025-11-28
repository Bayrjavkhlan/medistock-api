import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentCreateInput } from "../types";

export const EquipmentCreate = mutationField("equipmentCreate", {
  type: "Boolean",
  args: {
    input: nonNull(EquipmentCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { name, serialNo, hospitalId, staffId, category, state } = input;

    const hospital = await ctx.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });
    if (!hospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();

    if (staffId) {
      const staff = await ctx.prisma.staff.findUnique({
        where: { id: staffId },
      });
      if (!staff) throw Errors.Staff.STAFF_NOT_FOUND();
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
        assignedTo: staffId ? { connect: { id: staffId } } : undefined,
        createdBy: ctx.reqStaff?.staff?.id,
      },
    });

    return true;
  },
});
