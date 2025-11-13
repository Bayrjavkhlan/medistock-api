import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentCreateInput } from "../types";

export const equipmentUpdate = mutationField("equipmentUpdate", {
  type: "Boolean",
  args: {
    id: nonNull("String"),
    input: nonNull(EquipmentCreateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const { name, serialNo, hospitalId, userId, category, state } = input;

    const equipment = await ctx.prisma.equipment.findUnique({
      where: { id },
      select: { serialNo: true, hospitalId: true },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    let targetHospitalId = equipment.hospitalId;
    if (hospitalId && hospitalId !== equipment.hospitalId) {
      const hospital = await ctx.prisma.hospital.findUnique({
        where: { id: hospitalId },
      });
      if (!hospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();
      targetHospitalId = hospitalId;
    }

    if (userId !== null) {
      const user = await ctx.prisma.user.findFirst({
        where: { id: userId, hospitalId: targetHospitalId },
      });
      if (!user) throw Errors.Hospital.STAFF_NOT_IN_HOSPITAL();
    }

    if (serialNo && serialNo !== equipment.serialNo) {
      const existing = await ctx.prisma.equipment.findUnique({
        where: { serialNo },
      });
      if (existing) throw Errors.Equipment.DUPLICATE_EQUIPMENT_SERIAL_NUMBER();
    }

    await ctx.prisma.equipment.update({
      where: { id },
      data: {
        name,
        serialNo,
        category,
        state,
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
        assignedTo: userId ? { connect: { id: userId } } : { disconnect: true },
        updatedBy: ctx.reqUser?.user?.id,
      },
    });

    return true;
  },
});
