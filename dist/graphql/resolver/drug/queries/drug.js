"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.DrugDetail = (0, nexus_1.queryField)("drugDetail", {
    type: types_1.DrugObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Drug");
        const drug = await ctx.prisma.drug.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: {
                listings: {
                    include: {
                        pharmacy: {
                            include: {
                                organization: {
                                    include: {
                                        address: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: [{ quantity: "desc" }, { updatedAt: "desc" }],
                },
            },
        });
        if (!drug)
            return null;
        return drug;
    },
});
//# sourceMappingURL=drug.js.map