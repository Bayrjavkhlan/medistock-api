"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnosticPatientBookings = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.diagnosticPatientBookings = (0, nexus_1.queryField)("diagnosticPatientBookings", {
    type: types_1.DiagnosticPatientBookingListPayload,
    resolve: async (_parent, _args, ctx) => {
        if (!ctx.reqUser?.user) {
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Booking");
        const data = await ctx.prisma.booking.findMany({
            where: {
                ...criteria,
                type: "DIAGNOSTIC_TEST",
                patientUserId: ctx.reqUser.user.id,
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
            orderBy: [{ bookingTime: "asc" }, { createdAt: "desc" }],
        });
        return {
            data,
            count: data.length,
        };
    },
});
//# sourceMappingURL=diagnostic-patient-bookings.js.map