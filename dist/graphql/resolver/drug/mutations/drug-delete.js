"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.DrugDelete = (0, nexus_1.mutationField)("drugDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const drug = await ctx.prisma.drug.findUnique({ where: { id } });
        if (!drug)
            throw errors_1.Errors.Drug.DRUG_NOT_FOUND();
        await ctx.prisma.$transaction([
            ctx.prisma.pharmacyDrug.deleteMany({ where: { drugId: id } }),
            ctx.prisma.drug.delete({ where: { id } }),
        ]);
        return true;
    },
});
//# sourceMappingURL=drug-delete.js.map