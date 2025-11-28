import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { EquipmentCreateInput } from "../types";

export const EquipmentUpdate = mutationField("equipmentUpdate", {
  type: "Boolean",
  args: {
    id: nonNull("String"),
    input: nonNull(EquipmentCreateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const { name, serialNo, hospitalId, staffId, category, state } = input;

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

    const staff = await ctx.prisma.staff.findFirst({
      where: { id: staffId, hospitalId: targetHospitalId },
    });
    if (!staff) throw Errors.Hospital.STAFF_NOT_IN_HOSPITAL();

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
        assignedTo: staffId
          ? { connect: { id: staffId } }
          : { disconnect: true },
        updatedBy: ctx.reqStaff?.staff?.id,
      },
    });

    return true;
  },
});
