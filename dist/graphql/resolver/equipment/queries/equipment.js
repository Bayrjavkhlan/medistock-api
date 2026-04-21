"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.EquipmentDetail = (0, nexus_1.queryField)("equipmentDetail", {
    type: types_1.EquipmentObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Equipment");
        const equipment = await ctx.prisma.equipment.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: {
                hospital: { include: { organization: { include: { address: true } } } },
                logs: true,
                assignedTo: true,
            },
        });
        if (!equipment)
            return null;
        return equipment;
    },
});
//# sourceMappingURL=equipment.js.map