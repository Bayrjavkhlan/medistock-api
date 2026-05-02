import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

export const BookingDelete = mutationField("bookingDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "delete", "Booking");

    const booking = await ctx.prisma.booking.findFirst({
      where: {
        id,
        ...criteria,
      },
    });
    if (!booking) throw Errors.Booking.BOOKING_NOT_FOUND();

    await ctx.prisma.booking.delete({ where: { id } });

    return true;
  },
});
