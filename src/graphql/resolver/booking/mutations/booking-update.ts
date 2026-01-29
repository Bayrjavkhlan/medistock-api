import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { BookingCreateInput } from "../types";

export const BookingUpdate = mutationField("bookingUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(BookingCreateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "update", "Booking");

    const booking = await ctx.prisma.booking.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: { hospital: { include: { organization: true } } },
    });
    if (!booking) throw Errors.Booking.BOOKING_NOT_FOUND();

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

    await ctx.prisma.booking.update({
      where: { id },
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
