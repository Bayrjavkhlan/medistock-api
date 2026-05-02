import { inputObjectType } from "nexus";

import { BookingStatusEnum } from "@/graphql/typedef";

export const BookingsWhereInput = inputObjectType({
  name: "BookingsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.string("hospitalId");
    t.nullable.field("status", { type: BookingStatusEnum });
  },
});

export const BookingCreateInput = inputObjectType({
  name: "BookingCreateInput",
  definition: (t) => {
    t.nonNull.string("hospitalId");
    t.nonNull.string("patientName");
    t.nonNull.string("patientPhone");
    t.nonNull.string("department");
    t.string("doctorName");
    t.nonNull.dateTime("bookingTime");
    t.nonNull.field("status", { type: BookingStatusEnum });
  },
});
