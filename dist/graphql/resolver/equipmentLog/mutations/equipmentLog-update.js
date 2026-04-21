"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogUpdate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.EquipmentLogUpdate = (0, nexus_1.mutationField)("equipmentLogUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)("String"),
        input: (0, nexus_1.nonNull)(types_1.EquipmentLogUpdateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const { description } = input;
        const equipmentLog = await ctx.prisma.equipmentLog.findUnique({
            where: { id },
        });
        if (!equipmentLog)
            throw errors_1.Errors.EquipmentLog.EQUIPMENT_NOT_FOUND();
        await ctx.prisma.equipmentLog.update({
            where: { id },
            data: {
                description: description,
            },
        });
        return true;
    },
});
//# sourceMappingURL=equipmentLog-update.js.map