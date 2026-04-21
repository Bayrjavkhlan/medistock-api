"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyUpdate = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.PharmacyUpdate = (0, nexus_1.mutationField)("pharmacyUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.PharmacyCreateInput),
    },
    resolve: async (_parents, { id, input }, ctx) => {
        const { name, email, phone, address } = input;
        const pharmacy = await ctx.prisma.pharmacy.findFirst({
            where: { id },
            include: { organization: true },
        });
        if (!pharmacy) {
            throw errors_1.Errors.Pharmacy.PHARMACY_NOT_FOUND();
        }
        const existingOrg = await ctx.prisma.organization.findFirst({
            where: {
                id: { not: pharmacy.organizationId },
                name,
                type: client_1.OrganizationType.PHARMACY,
            },
        });
        if (existingOrg)
            throw errors_1.Errors.Pharmacy.DUPLICATE_PHARMACY();
        const existingContact = await ctx.prisma.pharmacy.findFirst({
            where: {
                id: { not: id },
                OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
            },
        });
        if (existingContact)
            throw errors_1.Errors.Pharmacy.DUPLICATE_PHARMACY();
        await ctx.prisma.pharmacy.update({
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
//# sourceMappingURL=pharmacy-update.js.map