"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUpdate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.MembershipUpdate = (0, nexus_1.mutationField)("membershipUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.MembershipUpdateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "update", "Membership");
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
        if (membership.role === "OWNER" && input.role !== "OWNER") {
            const ownersCount = await ctx.prisma.membership.count({
                where: { organizationId, role: "OWNER" },
            });
            if (ownersCount <= 1)
                throw errors_1.Errors.Membership.LAST_OWNER();
        }
        await ctx.prisma.membership.update({
            where: { id },
            data: { role: input.role },
        });
        return true;
    },
});
//# sourceMappingURL=membership-update.js.map