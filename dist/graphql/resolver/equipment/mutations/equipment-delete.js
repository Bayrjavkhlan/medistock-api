"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.EquipmentDelete = (0, nexus_1.mutationField)("equipmentDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const equipment = await ctx.prisma.equipment.findUnique({
            where: { id },
        });
        if (!equipment)
            throw errors_1.Errors.Equipment.EQUIPMENT_NOT_FOUND();
        await ctx.prisma.$transaction([
            ctx.prisma.equipmentLog.deleteMany({ where: { equipmentId: id } }),
            ctx.prisma.equipment.delete({ where: { id } }),
        ]);
        return true;
    },
});
//# sourceMappingURL=equipment-delete.js.map