import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { BookingObjectType } from "../types";

export const BookingDetail = queryField("bookingDetail", {
  type: BookingObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Booking");

    const booking = await ctx.prisma.booking.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: {
        hospital: { include: { organization: { include: { address: true } } } },
      },
    });

    if (!booking) return null;

    return booking;
  },
});
