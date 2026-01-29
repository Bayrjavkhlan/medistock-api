import { objectType } from "nexus";
import { Booking } from "nexus-prisma";

import { HospitalObjectType } from "../../hospital";

export const BookingObjectType = objectType({
  name: Booking.$name,
  definition(t) {
    t.string(Booking.id.name);
    t.nullable.field(Booking.hospital.name, { type: HospitalObjectType });
    t.string(Booking.patientName.name);
    t.string(Booking.patientPhone.name);
    t.string(Booking.department.name);
    t.nullable.string(Booking.doctorName.name);
    t.dateTime(Booking.bookingTime.name);
    t.string(Booking.status.name);
    t.dateTime(Booking.createdAt.name);
    t.dateTime(Booking.updatedAt.name);
  },
});

export const BookingsObjectType = objectType({
  name: BookingObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: BookingObjectType });
    t.nonNull.int("count");
  },
});
