"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptom = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.symptom = (0, nexus_1.queryField)("symptom", {
    type: types_1.SymptomObjectType,
    args: {
        code: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { code }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Symptom");
        const data = await ctx.prisma.symptom.findFirst({
            where: {
                ...criteria,
                code,
            },
            include: {
                medications: {
                    include: {
                        drug: true,
                    },
                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                },
                tests: {
                    include: {
                        diagnosticTest: {
                            include: {
                                hospital: {
                                    include: {
                                        organization: {
                                            include: {
                                                address: true,
                                            },
                                        },
                                    },
                                },
                                assignedDoctor: true,
                                timeSlots: {
                                    where: { isActive: true },
                                    orderBy: { startTime: "asc" },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!data) {
            throw errors_1.Errors.System.DATA_NOT_FOUND();
        }
        return data;
    },
});
//# sourceMappingURL=symptom.js.map