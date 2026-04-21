"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.HospitalDetail = (0, nexus_1.queryField)("hospitalDetail", {
    type: types_1.HospitalObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Hospital");
        const hospital = await ctx.prisma.hospital.findFirst({
            where: {
                id,
                ...criteria,
            },
            include: { organization: { include: { address: true } } },
        });
        if (!hospital)
            return null;
        return hospital;
    },
});
//# sourceMappingURL=hospital.js.map