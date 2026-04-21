"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipments = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.Equipments = (0, nexus_1.queryField)("equipments", {
    type: types_1.EquipementsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.EquipmentsWhereInput }),
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
                            name: {
                                contains: where.search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            serialNo: {
                                contains: where.search,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            assignedTo: {
                                is: {
                                    name: {
                                        contains: where.search,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                        {
                            hospital: {
                                is: {
                                    organization: {
                                        is: {
                                            name: {
                                                contains: where.search,
                                                mode: client_1.Prisma.QueryMode.insensitive,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                }
                : undefined;
            const equipments = await ctx.prisma.equipment.findMany({
                where: adminWhere,
                include: {
                    hospital: {
                        include: { organization: { include: { address: true } } },
                    },
                    logs: true,
                    assignedTo: true,
                },
                skip,
                take,
            });
            const count = await ctx.prisma.equipment.count({
                where: adminWhere,
            });
            return {
                data: equipments,
                count,
            };
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Equipment");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { serialNo: { contains: search, mode: "insensitive" } },
                {
                    assignedTo: {
                        is: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                },
                {
                    hospital: {
                        is: {
                            organization: {
                                is: {
                                    name: { contains: search, mode: "insensitive" },
                                },
                            },
                        },
                    },
                },
            ];
        }
        const equipments = await ctx.prisma.equipment.findMany({
            where: criteria,
            include: {
                hospital: {
                    include: { organization: { include: { address: true } } },
                },
                logs: true,
                assignedTo: true,
            },
            skip,
            take,
        });
        const count = await ctx.prisma.equipment.count({
            where: criteria,
        });
        return {
            data: equipments,
            count,
        };
    },
});
//# sourceMappingURL=equipments.js.map