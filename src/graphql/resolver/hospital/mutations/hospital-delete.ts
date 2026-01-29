import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const HospitalDelete = mutationField("hospitalDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parents, { id }, ctx) => {
    const hospital = await ctx.prisma.hospital.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!hospital) throw Errors.Hospital.HOSPITAL_NOT_FOUND();

    await ctx.prisma.$transaction([
      ctx.prisma.equipmentLog.deleteMany({
        where: { equipment: { hospitalId: id } },
      }),
      ctx.prisma.equipment.deleteMany({ where: { hospitalId: id } }),
      ctx.prisma.booking.deleteMany({ where: { hospitalId: id } }),
      ctx.prisma.hospital.delete({ where: { id } }),
      ctx.prisma.address.deleteMany({
        where: { organizationId: hospital.organizationId },
      }),
      ctx.prisma.organization.delete({
        where: { id: hospital.organizationId },
      }),
    ]);

    return true;
  },
});
