"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentUpdate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.EquipmentUpdate = (0, nexus_1.mutationField)("equipmentUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)("String"),
        input: (0, nexus_1.nonNull)(types_1.EquipmentCreateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const { name, serialNo, hospitalId, assignedToId, category, state } = input;
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "update", "Equipment");
        const equipment = await ctx.prisma.equipment.findFirst({
            where: { id, ...criteria },
            select: { serialNo: true, hospitalId: true },
        });
        if (!equipment)
            throw errors_1.Errors.Equipment.EQUIPMENT_NOT_FOUND();
        let targetHospitalId = equipment.hospitalId;
        const baseHospital = await ctx.prisma.hospital.findUnique({
            where: { id: targetHospitalId },
            select: { organizationId: true },
        });
        if (!baseHospital)
            throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
        let targetOrganizationId = baseHospital.organizationId;
        if (hospitalId && hospitalId !== equipment.hospitalId) {
            const hospital = await ctx.prisma.hospital.findUnique({
                where: { id: hospitalId },
                include: { organization: true },
            });
            if (!hospital)
                throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
            if (!ctx.reqUser?.user?.isPlatformAdmin &&
                (!ctx.activeOrg ||
                    ctx.activeOrg.organization.id !== hospital.organizationId)) {
                throw errors_1.Errors.System.PERMISSION_DENIED();
            }
            targetHospitalId = hospitalId;
            targetOrganizationId = hospital.organizationId;
        }
        if (assignedToId !== undefined) {
            if (assignedToId) {
                const membership = await ctx.prisma.membership.findFirst({
                    where: {
                        userId: assignedToId,
                        organizationId: targetOrganizationId,
                    },
                });
                if (!membership)
                    throw errors_1.Errors.System.PERMISSION_DENIED();
            }
        }
        if (serialNo && serialNo !== equipment.serialNo) {
            const existing = await ctx.prisma.equipment.findUnique({
                where: { serialNo },
            });
            if (existing)
                throw errors_1.Errors.Equipment.DUPLICATE_EQUIPMENT_SERIAL_NUMBER();
        }
        await ctx.prisma.equipment.update({
            where: { id },
            data: {
                name,
                serialNo,
                category,
                state,
                hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
                assignedTo: assignedToId === undefined
                    ? undefined
                    : assignedToId
                        ? { connect: { id: assignedToId } }
                        : { disconnect: true },
            },
        });
        return true;
    },
});
//# sourceMappingURL=equipment-update.js.map