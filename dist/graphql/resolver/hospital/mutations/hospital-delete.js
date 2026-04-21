"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.HospitalDelete = (0, nexus_1.mutationField)("hospitalDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parents, { id }, ctx) => {
        const hospital = await ctx.prisma.hospital.findUnique({
            where: { id },
            include: { organization: true },
        });
        if (!hospital)
            throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
        await ctx.prisma.$transaction([
            ctx.prisma.equipmentLog.deleteMany({
                where: { equipment: { hospitalId: id } },
            }),
            ctx.prisma.equipment.deleteMany({ where: { hospitalId: id } }),
            ctx.prisma.booking.deleteMany({ where: { hospitalId: id } }),
            ctx.prisma.hospital.delete({ where: { id } }),
            ctx.prisma.address.deleteMany({
                where: { organizationId: hospital.organizationId },
            }),
            ctx.prisma.organization.delete({
                where: { id: hospital.organizationId },
            }),
        ]);
        return true;
    },
});
//# sourceMappingURL=hospital-delete.js.map