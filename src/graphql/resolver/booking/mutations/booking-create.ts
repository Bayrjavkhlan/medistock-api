import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { BookingCreateInput } from "../types";

export const BookingCreate = mutationField("bookingCreate", {
  type: "Boolean",
  args: {
    input: nonNull(BookingCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    accessibleBy(ctx.caslAbility, "create", "Booking");

    const {
      hospitalId,
      patientName,
      patientPhone,
      department,
      doctorName,
      bookingTime,
      status,
    } = input;

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

    await ctx.prisma.booking.create({
      data: {
        hospital: { connect: { id: hospitalId } },
        patientName,
        patientPhone,
        department,
        doctorName: doctorName ?? null,
        bookingTime,
        status,
      },
    });

    return true;
  },
});
