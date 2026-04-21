"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipCreate = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const types_1 = require("../types");
exports.MembershipCreate = (0, nexus_1.mutationField)("membershipCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.MembershipCreateInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        (0, casl_1.accessibleBy)(ctx.caslAbility, "create", "Membership");
        const organizationId = ctx.activeOrg?.organization.id;
        if (!organizationId)
            throw errors_1.Errors.System.PERMISSION_DENIED();
        const { userId, role } = input;
        const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw errors_1.Errors.User.USER_NOT_FOUND();
        const existing = await ctx.prisma.membership.findUnique({
            where: {
                userId_organizationId: { userId, organizationId },
            },
        });
        if (existing)
            throw errors_1.Errors.Membership.DUPLICATE_MEMBERSHIP();
        await ctx.prisma.membership.create({
            data: {
                userId,
                organizationId,
                role,
            },
        });
        return true;
    },
});
//# sourceMappingURL=membership-create.js.map