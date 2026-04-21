"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptoms = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.symptoms = (0, nexus_1.queryField)("symptoms", {
    type: types_1.SymptomOptionsPayload,
    resolve: async (_parent, _args, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Symptom");
        const data = await ctx.prisma.symptom.findMany({
            where: criteria,
            select: {
                id: true,
                code: true,
                name: true,
            },
            orderBy: { name: "asc" },
        });
        return {
            data,
            count: data.length,
        };
    },
});
//# sourceMappingURL=symptoms.js.map