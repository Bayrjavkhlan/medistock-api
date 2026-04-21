"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalUpdate = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.HospitalUpdate = (0, nexus_1.mutationField)("hospitalUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.HospitalCreateInput),
    },
    resolve: async (_, { id, input }, ctx) => {
        const { name, email, phone, address } = input;
        const hospital = await ctx.prisma.hospital.findFirst({
            where: { id },
            include: { organization: true },
        });
        if (!hospital) {
            throw errors_1.Errors.Hospital.HOSPITAL_NOT_FOUND();
        }
        const existingOrg = await ctx.prisma.organization.findFirst({
            where: {
                id: { not: hospital.organizationId },
                name,
                type: client_1.OrganizationType.HOSPITAL,
            },
        });
        if (existingOrg)
            throw errors_1.Errors.Hospital.DUPLICATE_HOSPITAL();
        const existingContact = await ctx.prisma.hospital.findFirst({
            where: {
                id: { not: id },
                OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
            },
        });
        if (existingContact)
            throw errors_1.Errors.Hospital.DUPLICATE_HOSPITAL();
        await ctx.prisma.hospital.update({
            where: { id },
            data: {
                email,
                phone,
                organization: {
                    update: {
                        name,
                        address: {
                            upsert: {
                                create: {
                                    address1: address.address1,
                                    address2: address.address2 || null,
                                    province: address.province,
                                },
                                update: {
                                    address1: address.address1,
                                    address2: address.address2 || null,
                                    province: address.province,
                                },
                            },
                        },
                    },
                },
            },
        });
        return true;
    },
});
//# sourceMappingURL=hospital-update.js.map