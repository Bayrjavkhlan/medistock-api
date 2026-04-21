"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentCreate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.EquipmentCreate = (0, nexus_1.mutationField)("equipmentCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.EquipmentCreateInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        const { name, serialNo, hospitalId, assignedToId, category, state } = input;
        const hospital = await ctx.prisma.hospital.findUnique({
            where: { id: hospitalId },
            include: { organization: true },
        });
        if (!hospital)
            throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
        if (!ctx.reqUser?.user)
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        if (!ctx.reqUser.user.isPlatformAdmin &&
            (!ctx.activeOrg ||
                ctx.activeOrg.organization.id !== hospital.organizationId)) {
            throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        if (assignedToId) {
            const membership = await ctx.prisma.membership.findFirst({
                where: {
                    userId: assignedToId,
                    organizationId: hospital.organizationId,
                },
            });
            if (!membership)
                throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        const existing = await ctx.prisma.equipment.findUnique({
            where: { serialNo },
        });
        if (existing)
            throw errors_1.Errors.Equipment.DUPLICATE_EQUIPMENT_SERIAL_NUMBER();
        await ctx.prisma.equipment.create({
            data: {
                name,
                serialNo,
                category,
                state,
                hospital: { connect: { id: hospitalId } },
                assignedTo: assignedToId
                    ? { connect: { id: assignedToId } }
                    : undefined,
            },
        });
        return true;
    },
});
//# sourceMappingURL=equipment-create.js.map