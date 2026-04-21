"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyCreate = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.PharmacyCreate = (0, nexus_1.mutationField)("pharmacyCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.PharmacyCreateInput),
    },
    resolve: async (_parents, { input }, ctx) => {
        const { name, email, phone, address } = input;
        const existingOrg = await ctx.prisma.organization.findFirst({
            where: { name, type: client_1.OrganizationType.PHARMACY },
        });
        if (existingOrg)
            throw errors_1.Errors.Pharmacy.DUPLICATE_PHARMACY();
        const existingContact = await ctx.prisma.pharmacy.findFirst({
            where: {
                OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
            },
        });
        if (existingContact)
            throw errors_1.Errors.Pharmacy.DUPLICATE_PHARMACY();
        await ctx.prisma.organization.create({
            data: {
                name,
                type: client_1.OrganizationType.PHARMACY,
                address: {
                    create: {
                        address1: address.address1,
                        address2: address.address2 || null,
                        province: address.province,
                    },
                },
                pharmacy: {
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
//# sourceMappingURL=pharmacy-create.js.map