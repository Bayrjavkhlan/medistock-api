"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.EquipmentLogDetail = (0, nexus_1.queryField)("equipmentLogDetail", {
    type: types_1.EquipmentLogObjectType,
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "EquipmentLog");
        const equipmentLog = await ctx.prisma.equipmentLog.findFirst({
            where: {
                id,
                ...criteria,
            },
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
        if (!equipmentLog)
            return null;
        return equipmentLog;
    },
});
//# sourceMappingURL=equipmentLog.js.map