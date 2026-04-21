"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetail = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.UserDetail = (0, nexus_1.queryField)("userDetail", {
    type: types_1.UserObjectType,
    args: { id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "User");
        const user = await ctx.prisma.user.findFirst({
            where: {
                id,
                ...criteria,
            },
        });
        if (!user)
            return null;
        return user;
    },
});
//# sourceMappingURL=user.js.map