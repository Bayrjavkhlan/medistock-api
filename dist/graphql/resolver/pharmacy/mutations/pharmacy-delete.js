"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.PharmacyDelete = (0, nexus_1.mutationField)("pharmacyDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parents, { id }, ctx) => {
        const pharmacy = await ctx.prisma.pharmacy.findUnique({
            where: { id },
        });
        if (!pharmacy)
            throw errors_1.Errors.Pharmacy.PHARMACY_NOT_FOUND();
        await ctx.prisma.pharmacy.delete({ where: { id } });
        return true;
    },
});
//# sourceMappingURL=pharmacy-delete.js.map