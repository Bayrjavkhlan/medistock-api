import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { BookingsObjectType, BookingsWhereInput } from "../types";

export const Bookings = queryField("bookings", {
  type: BookingsObjectType,
  args: {
    where: arg({ type: BookingsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "Booking");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { patientName: { contains: search, mode: "insensitive" } },
        { patientPhone: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { doctorName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (where?.hospitalId) {
      criteria.hospitalId = where.hospitalId;
    }

    if (where?.status) {
      criteria.status = where.status;
    }

    const bookings = await ctx.prisma.booking.findMany({
      where: criteria,
      include: {
        hospital: { include: { organization: { include: { address: true } } } },
      },
      ...pagination(take, skip),
    });

    return {
      data: bookings,
      count: bookings.length,
    };
  },
});
