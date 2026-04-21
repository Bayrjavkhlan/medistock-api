"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.BookingDetail = (0, nexus_1.queryField)("bookingDetail", {
    type: types_1.BookingObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Booking");
        const booking = await ctx.prisma.booking.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: {
                hospital: { include: { organization: { include: { address: true } } } },
            },
        });
        if (!booking)
            return null;
        return booking;
    },
});
//# sourceMappingURL=booking.js.map