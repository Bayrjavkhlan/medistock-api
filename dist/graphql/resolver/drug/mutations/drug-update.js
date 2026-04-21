"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugUpdate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.DrugUpdate = (0, nexus_1.mutationField)("drugUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.DrugCreateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const { name, genericName, dosageForm, strength, manufacturer, description, } = input;
        const drug = await ctx.prisma.drug.findUnique({ where: { id } });
        if (!drug)
            throw errors_1.Errors.Drug.DRUG_NOT_FOUND();
        const existing = await ctx.prisma.drug.findFirst({
            where: {
                id: { not: id },
                name,
                strength: strength ?? null,
                dosageForm: dosageForm ?? null,
            },
        });
        if (existing)
            throw errors_1.Errors.Drug.DUPLICATE_DRUG();
        await ctx.prisma.drug.update({
            where: { id },
            data: {
                name,
                genericName,
                dosageForm,
                strength,
                manufacturer,
                description,
            },
        });
        return true;
    },
});
//# sourceMappingURL=drug-update.js.map