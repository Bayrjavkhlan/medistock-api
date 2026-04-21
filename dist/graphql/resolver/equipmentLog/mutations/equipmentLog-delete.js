"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.EquipmentLogDelete = (0, nexus_1.mutationField)("equipmentLogDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const equipmentLog = await ctx.prisma.equipmentLog.findUnique({
            where: { id },
        });
        if (!equipmentLog)
            throw errors_1.Errors.EquipmentLog.EQUIPMENT_NOT_FOUND();
        await ctx.prisma.equipmentLog.delete({ where: { id } });
        return true;
    },
});
//# sourceMappingURL=equipmentLog-delete.js.map