"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsObjectType = exports.BookingObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const diagnostic_1 = require("../../diagnostic");
const hospital_1 = require("../../hospital");
exports.BookingObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Booking.$name,
    definition(t) {
        t.string(nexus_prisma_1.Booking.id.name);
        t.nullable.field(nexus_prisma_1.Booking.hospital.name, { type: hospital_1.HospitalObjectType });
        t.nullable.string("patientUserId");
        t.string(nexus_prisma_1.Booking.patientName.name);
        t.string(nexus_prisma_1.Booking.patientPhone.name);
        t.string(nexus_prisma_1.Booking.department.name);
        t.nullable.string(nexus_prisma_1.Booking.doctorName.name);
        t.dateTime(nexus_prisma_1.Booking.bookingTime.name);
        t.string(nexus_prisma_1.Booking.status.name);
        t.string("type");
        t.nullable.field("diagnosticTest", {
            type: diagnostic_1.DiagnosticTestObjectType,
        });
        t.nullable.field("diagnosticTimeSlot", {
            type: diagnostic_1.DiagnosticTimeSlotObjectType,
        });
        t.dateTime(nexus_prisma_1.Booking.createdAt.name);
        t.dateTime(nexus_prisma_1.Booking.updatedAt.name);
    },
});
exports.BookingsObjectType = (0, nexus_1.objectType)({
    name: exports.BookingObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.BookingObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map