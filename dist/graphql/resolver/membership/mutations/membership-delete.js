"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
exports.MembershipDelete = (0, nexus_1.mutationField)("membershipDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "delete", "Membership");
        const organizationId = ctx.activeOrg?.organization.id;
        if (!organizationId)
            throw errors_1.Errors.System.PERMISSION_DENIED();
        const membership = await ctx.prisma.membership.findFirst({
            where: {
                id,
                organizationId,
                ...criteria,
            },
        });
        if (!membership)
            throw errors_1.Errors.Membership.MEMBERSHIP_NOT_FOUND();
        if (membership.role === "OWNER") {
            const ownersCount = await ctx.prisma.membership.count({
                where: { organizationId, role: "OWNER" },
            });
            if (ownersCount <= 1)
                throw errors_1.Errors.Membership.LAST_OWNER();
        }
        await ctx.prisma.membership.delete({ where: { id } });
        return true;
    },
});
//# sourceMappingURL=membership-delete.js.map