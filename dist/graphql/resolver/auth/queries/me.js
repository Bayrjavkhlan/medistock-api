"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.Me = (0, nexus_1.queryField)("me", {
    type: types_1.MePayload,
    resolve: async (_parent, _args, ctx) => {
        if (!ctx.reqUser?.user)
            return null;
        return {
            user: ctx.reqUser.user,
            activeOrganization: ctx.activeOrg
                ? {
                    role: ctx.activeOrg.role,
                    organization: ctx.activeOrg.organization,
                }
                : null,
        };
    },
});
//# sourceMappingURL=me.js.map