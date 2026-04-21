"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDrugUpsert = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.PharmacyDrugUpsert = (0, nexus_1.mutationField)("pharmacyDrugUpsert", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.PharmacyDrugUpsertInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        const organizationId = ctx.activeOrg?.organization.id;
        const organizationType = ctx.activeOrg?.organization.type;
        if (!organizationId || organizationType !== "PHARMACY") {
            throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        const pharmacy = await ctx.prisma.pharmacy.findUnique({
            where: { organizationId },
        });
        if (!pharmacy)
            throw errors_1.Errors.System.PERMISSION_DENIED();
        const drug = await ctx.prisma.drug.findUnique({
            where: { id: input.drugId },
        });
        if (!drug)
            throw errors_1.Errors.Drug.DRUG_NOT_FOUND();
        await ctx.prisma.pharmacyDrug.upsert({
            where: {
                pharmacyId_drugId: {
                    pharmacyId: pharmacy.id,
                    drugId: input.drugId,
                },
            },
            update: {
                quantity: input.quantity,
                price: input.price ?? null,
                status: input.status,
            },
            create: {
                pharmacyId: pharmacy.id,
                drugId: input.drugId,
                quantity: input.quantity,
                price: input.price ?? null,
                status: input.status,
            },
        });
        return true;
    },
});
//# sourceMappingURL=pharmacy-drug-upsert.js.map