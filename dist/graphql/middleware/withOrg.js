"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveActiveOrg = void 0;
const errors_1 = require("../../errors");
const resolveActiveOrg = (req, reqUser) => {
    if (!reqUser?.user)
        return null;
    const headerOrgId = req.headers["x-org-id"];
    const cookieOrgId = req.cookies?.["x-org-id"];
    const orgId = typeof headerOrgId === "string" && headerOrgId.trim().length > 0
        ? headerOrgId.trim()
        : typeof cookieOrgId === "string" && cookieOrgId.trim().length > 0
            ? cookieOrgId.trim()
            : null;
    if (!orgId) {
        const fallbackMembership = reqUser.user.memberships[0];
        if (fallbackMembership) {
            return {
                role: fallbackMembership.role,
                organization: fallbackMembership.organization,
            };
        }
        return null;
    }
    const membership = reqUser.user.memberships.find((item) => item.organization.id === orgId);
    if (!membership) {
        if (reqUser.user.isPlatformAdmin)
            return null;
        const fallbackMembership = reqUser.user.memberships[0];
        if (fallbackMembership) {
            return {
                role: fallbackMembership.role,
                organization: fallbackMembership.organization,
            };
        }
        throw errors_1.Errors.System.PERMISSION_DENIED();
    }
    return {
        role: membership.role,
        organization: membership.organization,
    };
};
exports.resolveActiveOrg = resolveActiveOrg;
//# sourceMappingURL=withOrg.js.map