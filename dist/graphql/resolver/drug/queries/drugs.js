"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drugs = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Drugs = (0, nexus_1.queryField)("drugs", {
    type: types_1.DrugsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.DrugsWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, _args, ctx) => {
        const { where, take, skip } = _args;
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Drug");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                {
                    genericName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive },
                },
                {
                    manufacturer: {
                        contains: search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    strength: { contains: search, mode: client_1.Prisma.QueryMode.insensitive },
                },
                {
                    dosageForm: { contains: search, mode: client_1.Prisma.QueryMode.insensitive },
                },
            ];
        }
        const drugs = await ctx.prisma.drug.findMany({
            where: criteria,
            include: {
                listings: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                    },
                },
            },
            ...(0, prisma_1.pagination)(take, skip),
        });
        const count = await ctx.prisma.drug.count({
            where: criteria,
        });
        return {
            data: drugs,
            count,
        };
    },
});
//# sourceMappingURL=drugs.js.map