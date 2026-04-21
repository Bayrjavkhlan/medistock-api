"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDrugDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.PharmacyDrugDelete = (0, nexus_1.mutationField)("pharmacyDrugDelete", {
    type: "Boolean",
    args: {
        drugId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { drugId }, ctx) => {
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
        const listing = await ctx.prisma.pharmacyDrug.findUnique({
            where: {
                pharmacyId_drugId: {
                    pharmacyId: pharmacy.id,
                    drugId,
                },
            },
        });
        if (!listing)
            return true;
        await ctx.prisma.pharmacyDrug.delete({
            where: {
                pharmacyId_drugId: {
                    pharmacyId: pharmacy.id,
                    drugId,
                },
            },
        });
        return true;
    },
});
//# sourceMappingURL=pharmacy-drug-delete.js.map