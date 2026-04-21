"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.PharmacyDetail = (0, nexus_1.queryField)("pharmacyDetail", {
    type: types_1.PharmacyObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Pharmacy");
        const pharmacy = await ctx.prisma.pharmacy.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: {
                organization: { include: { address: true } },
                inventory: {
                    include: { drug: true },
                    orderBy: [{ updatedAt: "desc" }, { quantity: "desc" }],
                },
            },
        });
        if (!pharmacy)
            return null;
        return pharmacy;
    },
});
//# sourceMappingURL=pharmacy.js.map