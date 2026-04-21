"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hospitals = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Hospitals = (0, nexus_1.queryField)("hospitals", {
    type: types_1.HospitalsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.HospitalsWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, _args, ctx) => {
        const { where, take, skip } = _args;
        if (ctx.reqUser?.user?.isPlatformAdmin) {
            const adminWhere = where?.search
                ? {
                    OR: [
                        {
                            organization: {
                                is: {
                                    name: {
                                        contains: where.search,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                        {
                            email: {
                                contains: where.search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            phone: {
                                contains: where.search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    ],
                }
                : undefined;
            const hospitals = await ctx.prisma.hospital.findMany({
                where: adminWhere,
                include: { organization: { include: { address: true } } },
                ...(0, prisma_1.pagination)(take, skip),
            });
            const count = await ctx.prisma.hospital.count({
                where: adminWhere,
            });
            return {
                data: hospitals,
                count,
            };
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Hospital");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                {
                    organization: {
                        is: { name: { contains: search, mode: "insensitive" } },
                    },
                },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }
        if (where?.address) {
            // todo filter by address
        }
        const hospitals = await ctx.prisma.hospital.findMany({
            where: criteria,
            include: { organization: { include: { address: true } } },
            ...(0, prisma_1.pagination)(take, skip),
        });
        const count = await ctx.prisma.hospital.count({
            where: criteria,
        });
        return {
            data: hospitals,
            count,
        };
    },
});
//# sourceMappingURL=hospitals.js.map