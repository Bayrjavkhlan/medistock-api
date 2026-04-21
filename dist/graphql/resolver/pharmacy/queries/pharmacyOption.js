"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyOption = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.PharmacyOption = (0, nexus_1.queryField)("pharmacyOption", {
    type: (0, nexus_1.nonNull)((0, nexus_1.list)((0, nexus_1.nonNull)(types_1.PharmacyOptionObjectType))),
    resolve: async (_parents, _args, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Pharmacy");
        const pharmacies = await ctx.prisma.pharmacy.findMany({
            where: criteria,
            include: { organization: true },
            orderBy: { organization: { name: "asc" } },
        });
        return pharmacies.map((pharmacy) => ({
            id: pharmacy.id,
            name: pharmacy.organization.name,
        }));
    },
});
//# sourceMappingURL=pharmacyOption.js.map