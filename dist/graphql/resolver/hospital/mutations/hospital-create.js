"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalCreate = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.hospitalCreate = (0, nexus_1.mutationField)("hospitalCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.HospitalCreateInput),
    },
    resolve: async (_parents, { input }, ctx) => {
        const { name, email, phone, address } = input;
        const existingOrg = await ctx.prisma.organization.findFirst({
            where: { name, type: client_1.OrganizationType.HOSPITAL },
        });
        if (existingOrg)
            throw errors_1.Errors.Hospital.DUPLICATE_HOSPITAL();
        const existingContact = await ctx.prisma.hospital.findFirst({
            where: {
                OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
            },
        });
        if (existingContact)
            throw errors_1.Errors.Hospital.DUPLICATE_HOSPITAL();
        await ctx.prisma.organization.create({
            data: {
                name,
                type: client_1.OrganizationType.HOSPITAL,
                address: {
                    create: {
                        address1: address.address1,
                        address2: address.address2 || null,
                        province: address.province,
                    },
                },
                hospital: {
                    create: {
                        email,
                        phone,
                    },
                },
            },
        });
        return true;
    },
});
//# sourceMappingURL=hospital-create.js.map