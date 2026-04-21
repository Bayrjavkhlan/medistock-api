"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pharmacies = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Pharmacies = (0, nexus_1.queryField)("pharmacies", {
    type: types_1.PharmaciesObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.PharmaciesWhereInput }),
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
            const pharmacies = await ctx.prisma.pharmacy.findMany({
                where: adminWhere,
                include: { organization: { include: { address: true } } },
                ...(0, prisma_1.pagination)(take, skip),
            });
            const count = await ctx.prisma.pharmacy.count({
                where: adminWhere,
            });
            return {
                data: pharmacies,
                count,
            };
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Pharmacy");
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
        const pharmacies = await ctx.prisma.pharmacy.findMany({
            where: criteria,
            include: { organization: { include: { address: true } } },
            ...(0, prisma_1.pagination)(take, skip),
        });
        const count = await ctx.prisma.pharmacy.count({
            where: criteria,
        });
        return {
            data: pharmacies,
            count,
        };
    },
});
//# sourceMappingURL=pharmacies.js.map