"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOrganization = void 0;
const nexus_1 = require("nexus");
const config_1 = require("../../../../config");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.SelectOrganization = (0, nexus_1.mutationField)("selectOrganization", {
    type: types_1.UserMembershipObject,
    args: {
        orgId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { orgId }, ctx) => {
        if (!ctx.reqUser?.user)
            throw errors_1.Errors.Auth.NOT_AUTHORIZED();
        const membership = ctx.reqUser.user.memberships.find((item) => item.organization.id === orgId);
        if (!membership)
            throw errors_1.Errors.System.PERMISSION_DENIED();
        ctx.res.setHeader("x-org-id", orgId);
        ctx.res.cookie("x-org-id", orgId, {
            httpOnly: true,
            sameSite: "lax",
            secure: config_1.env.NODE_ENV === "production",
            ...(config_1.env.COOKIE_DOMAIN ? { domain: config_1.env.COOKIE_DOMAIN } : {}),
        });
        return membership;
    },
});
//# sourceMappingURL=select-organization.js.map