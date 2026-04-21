"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnosticBookingCreate = void 0;
const graphql_1 = require("graphql");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
const combineBookingDateTime = (bookingDate, time) => {
    const date = new Date(bookingDate);
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
};
exports.diagnosticBookingCreate = (0, nexus_1.mutationField)("diagnosticBookingCreate", {
    type: types_1.DiagnosticBookingObjectType,
    args: {
        input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: types_1.DiagnosticBookingCreateInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
        if (!ctx.reqUser?.user) {
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        }
        const diagnosticTest = await ctx.prisma.diagnosticTest.findUnique({
            where: { id: input.diagnosticTestId },
            include: {
                hospital: true,
                assignedDoctor: true,
                timeSlots: true,
            },
        });
        if (!diagnosticTest || !diagnosticTest.isActive) {
            throw errors_1.Errors.System.DATA_NOT_FOUND();
        }
        const timeSlot = diagnosticTest.timeSlots.find((item) => item.id === input.diagnosticTimeSlotId && item.isActive);
        if (!timeSlot) {
            throw errors_1.Errors.System.DATA_NOT_FOUND();
        }
        const bookingTime = combineBookingDateTime(input.bookingDate, timeSlot.startTime);
        const bookingWindowEnd = combineBookingDateTime(input.bookingDate, timeSlot.endTime);
        if (bookingTime < new Date()) {
            throw new graphql_1.GraphQLError("Өнгөрсөн цаг дээр захиалга хийх боломжгүй.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        const slotBookingsCount = await ctx.prisma.booking.count({
            where: {
                diagnosticTimeSlotId: timeSlot.id,
                bookingTime: {
                    gte: bookingTime,
                    lt: bookingWindowEnd,
                },
                status: {
                    not: "CANCELLED",
                },
            },
        });
        if (slotBookingsCount >= timeSlot.capacity) {
            throw new graphql_1.GraphQLError("Сонгосон цаг дүүрсэн байна.", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }
        return ctx.prisma.booking.create({
            data: {
                hospitalId: diagnosticTest.hospitalId,
                patientUserId: ctx.reqUser.user.id,
                patientName: input.patientName,
                patientPhone: input.patientPhone,
                department: "Diagnostic",
                doctorName: diagnosticTest.assignedDoctor?.name ?? null,
                bookingTime,
                status: "PENDING",
                type: "DIAGNOSTIC_TEST",
                diagnosticTestId: diagnosticTest.id,
                diagnosticTimeSlotId: timeSlot.id,
            },
            include: {
                hospital: {
                    include: {
                        organization: {
                            include: {
                                address: true,
                            },
                        },
                    },
                },
                diagnosticTest: {
                    include: {
                        assignedDoctor: true,
                        timeSlots: true,
                    },
                },
                diagnosticTimeSlot: true,
            },
        });
    },
});
//# sourceMappingURL=diagnostic-booking-create.js.map