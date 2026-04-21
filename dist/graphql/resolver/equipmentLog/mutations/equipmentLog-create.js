"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogCreate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.EquipmentLogCreate = (0, nexus_1.mutationField)("equipmentLogCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.EquipmentLogCreateInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        const { equipmentId, description } = input;
        const equipment = await ctx.prisma.equipment.findUnique({
            where: { id: equipmentId },
            include: { hospital: { select: { organizationId: true } } },
        });
        if (!equipment)
            throw errors_1.Errors.Equipment.EQUIPMENT_NOT_FOUND();
        if (!ctx.reqUser?.user)
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        if (!ctx.reqUser.user.isPlatformAdmin &&
            (!ctx.activeOrg ||
                equipment.hospital.organizationId !== ctx.activeOrg.organization.id)) {
            throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        await ctx.prisma.equipmentLog.create({
            data: {
                equipment: { connect: { id: equipmentId } },
                performedBy: { connect: { id: ctx.reqUser.user.id } },
                description,
            },
        });
        return true;
    },
});
//# sourceMappingURL=equipmentLog-create.js.map