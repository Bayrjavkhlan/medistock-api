"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
exports.BookingDelete = (0, nexus_1.mutationField)("bookingDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "delete", "Booking");
        const booking = await ctx.prisma.booking.findFirst({
            where: {
                id,
                ...criteria,
            },
        });
        if (!booking)
            throw errors_1.Errors.Booking.BOOKING_NOT_FOUND();
        await ctx.prisma.booking.delete({ where: { id } });
        return true;
    },
});
//# sourceMappingURL=booking-delete.js.map