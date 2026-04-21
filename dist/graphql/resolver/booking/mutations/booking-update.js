"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingUpdate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.BookingUpdate = (0, nexus_1.mutationField)("bookingUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.BookingCreateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "update", "Booking");
        const booking = await ctx.prisma.booking.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: { hospital: { include: { organization: true } } },
        });
        if (!booking)
            throw errors_1.Errors.Booking.BOOKING_NOT_FOUND();
        const { hospitalId, patientName, patientPhone, department, doctorName, bookingTime, status, } = input;
        const hospital = await ctx.prisma.hospital.findUnique({
            where: { id: hospitalId },
            include: { organization: true },
        });
        if (!hospital)
            throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
        if (!ctx.reqUser?.user)
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        if (!ctx.reqUser.user.isPlatformAdmin &&
            (!ctx.activeOrg ||
                ctx.activeOrg.organization.id !== hospital.organizationId)) {
            throw errors_1.Errors.System.PERMISSION_DENIED();
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
//# sourceMappingURL=booking-update.js.map