"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDrugs = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.PharmacyDrugs = (0, nexus_1.queryField)("pharmacyDrugs", {
    type: types_1.PharmacyDrugsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.PharmacyDrugsWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, _args, ctx) => {
        const { where, take, skip } = _args;
        const organizationId = ctx.activeOrg?.organization.id;
        if (!organizationId)
            throw errors_1.Errors.System.PERMISSION_DENIED();
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "PharmacyDrug");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                {
                    drug: {
                        is: {
                            name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive },
                        },
                    },
                },
                {
                    drug: {
                        is: {
                            genericName: {
                                contains: search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                },
                {
                    drug: {
                        is: {
                            manufacturer: {
                                contains: search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                },
                {
                    drug: {
                        is: {
                            strength: {
                                contains: search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                },
                {
                    drug: {
                        is: {
                            dosageForm: {
                                contains: search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    },
                },
            ];
        }
        const pharmacyDrugs = await ctx.prisma.pharmacyDrug.findMany({
            where: {
                ...criteria,
                pharmacy: { organizationId },
            },
            include: { drug: true },
            ...(0, prisma_1.pagination)(take, skip),
        });
        const count = await ctx.prisma.pharmacyDrug.count({
            where: {
                ...criteria,
                pharmacy: { organizationId },
            },
        });
        return {
            data: pharmacyDrugs,
            count,
        };
    },
});
//# sourceMappingURL=pharmacy-drugs.js.map