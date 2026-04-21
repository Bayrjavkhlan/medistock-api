"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugCreate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.DrugCreate = (0, nexus_1.mutationField)("drugCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.DrugCreateInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        const { name, genericName, dosageForm, strength, manufacturer, description, } = input;
        const existing = await ctx.prisma.drug.findFirst({
            where: {
                name,
                strength: strength ?? null,
                dosageForm: dosageForm ?? null,
            },
        });
        if (existing)
            throw errors_1.Errors.Drug.DUPLICATE_DRUG();
        await ctx.prisma.drug.create({
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
//# sourceMappingURL=drug-create.js.map