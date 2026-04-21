"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogs = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.EquipmentLogs = (0, nexus_1.queryField)("equipmentLogs", {
    type: types_1.EquipmentLogsObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.EquipmentLogsWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parent, _args, ctx) => {
        const { where, take, skip } = _args;
        if (ctx.reqUser?.user?.isPlatformAdmin) {
            const adminWhere = where?.search
                ? {
                    OR: [
                        {
                            equipment: {
                                is: {
                                    name: {
                                        contains: where.search,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                        {
                            performedBy: {
                                is: {
                                    name: {
                                        contains: where.search,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                    ],
                }
                : undefined;
            const equipmentLogs = await ctx.prisma.equipmentLog.findMany({
                where: adminWhere,
                skip,
                take,
                include: {
                    equipment: {
                        include: {
                            hospital: {
                                include: { organization: { include: { address: true } } },
                            },
                            assignedTo: true,
                        },
                    },
                    performedBy: true,
                },
            });
            const count = await ctx.prisma.equipmentLog.count({
                where: adminWhere,
            });
            return {
                data: equipmentLogs,
                count,
            };
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "EquipmentLog");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                {
                    equipment: {
                        is: { name: { contains: search, mode: "insensitive" } },
                    },
                },
                {
                    performedBy: {
                        is: { name: { contains: search, mode: "insensitive" } },
                    },
                },
            ];
        }
        const equipmentLogs = await ctx.prisma.equipmentLog.findMany({
            where: criteria,
            skip,
            take,
            include: {
                equipment: {
                    include: {
                        hospital: {
                            include: { organization: { include: { address: true } } },
                        },
                        assignedTo: true,
                    },
                },
                performedBy: true,
            },
        });
        const count = await ctx.prisma.equipmentLog.count({
            where: criteria,
        });
        return {
            data: equipmentLogs,
            count,
        };
    },
});
//# sourceMappingURL=equipmentLogs.js.map