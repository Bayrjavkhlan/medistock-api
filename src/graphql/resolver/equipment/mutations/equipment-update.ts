import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { EquipmentCreateInput } from "../types";

export const EquipmentUpdate = mutationField("equipmentUpdate", {
  type: "Boolean",
  args: {
    id: nonNull("String"),
    input: nonNull(EquipmentCreateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const { name, serialNo, hospitalId, assignedToId, category, state } = input;

    const criteria = accessibleBy(ctx.caslAbility, "update", "Equipment");

    const equipment = await ctx.prisma.equipment.findFirst({
      where: { id, ...criteria },
      select: { serialNo: true, hospitalId: true },
    });
    if (!equipment) throw Errors.Equipment.EQUIPMENT_NOT_FOUND();

    let targetHospitalId = equipment.hospitalId;
    const baseHospital = await ctx.prisma.hospital.findUnique({
      where: { id: targetHospitalId },
      select: { organizationId: true },
    });
    if (!baseHospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();
    let targetOrganizationId = baseHospital.organizationId;
    if (hospitalId && hospitalId !== equipment.hospitalId) {
      const hospital = await ctx.prisma.hospital.findUnique({
        where: { id: hospitalId },
        include: { organization: true },
      });
      if (!hospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();
      if (
        !ctx.reqUser?.user?.isPlatformAdmin &&
        (!ctx.activeOrg ||
          ctx.activeOrg.organization.id !== hospital.organizationId)
      ) {
        throw Errors.System.PERMISSION_DENIED();
      }
      targetHospitalId = hospitalId;
      targetOrganizationId = hospital.organizationId;
    }

    if (assignedToId !== undefined) {
      if (assignedToId) {
        const membership = await ctx.prisma.membership.findFirst({
          where: {
            userId: assignedToId,
            organizationId: targetOrganizationId,
          },
        });
        if (!membership) throw Errors.System.PERMISSION_DENIED();
      }
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
        assignedTo:
          assignedToId === undefined
            ? undefined
            : assignedToId
              ? { connect: { id: assignedToId } }
              : { disconnect: true },
      },
    });

    return true;
  },
});
