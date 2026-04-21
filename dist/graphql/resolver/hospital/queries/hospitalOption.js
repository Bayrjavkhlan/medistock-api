"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalOption = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.HospitalOption = (0, nexus_1.queryField)("hospitalOption", {
    type: (0, nexus_1.nonNull)((0, nexus_1.list)((0, nexus_1.nonNull)(types_1.HospitalOptionObjectType))),
    resolve: async (_parents, _args, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Hospital");
        const hospitals = await ctx.prisma.hospital.findMany({
            where: criteria,
            include: { organization: true },
            orderBy: { organization: { name: "asc" } },
        });
        return hospitals.map((hospital) => ({
            id: hospital.id,
            name: hospital.organization.name,
        }));
    },
});
//# sourceMappingURL=hospitalOption.js.map