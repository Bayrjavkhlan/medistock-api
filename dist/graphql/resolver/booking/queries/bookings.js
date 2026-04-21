"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookings = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Bookings = (0, nexus_1.queryField)("bookings", {
    type: types_1.BookingsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.BookingsWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, _args, ctx) => {
        const { where, take, skip } = _args;
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Booking");
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
            ...(0, prisma_1.pagination)(take, skip),
        });
        return {
            data: bookings,
            count: bookings.length,
        };
    },
});
//# sourceMappingURL=bookings.js.map