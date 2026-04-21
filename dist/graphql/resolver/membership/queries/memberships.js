"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memberships = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Memberships = (0, nexus_1.queryField)("memberships", {
    type: types_1.MembershipsObjectType,
    args: {
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, { take, skip }, ctx) => {
        if (ctx.reqUser?.user?.isPlatformAdmin) {
            const memberships = await ctx.prisma.membership.findMany({
                include: { user: true, organization: true },
                ...(0, prisma_1.pagination)(take, skip),
            });
            const count = await ctx.prisma.membership.count();
            return {
                data: memberships,
                count,
            };
        }
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "Membership");
        const organizationId = ctx.activeOrg?.organization.id;
        if (!organizationId) {
            throw errors_1.Errors.System.PERMISSION_DENIED();
        }
        const memberships = await ctx.prisma.membership.findMany({
            where: { ...criteria, organizationId },
            include: { user: true, organization: true },
            ...(0, prisma_1.pagination)(take, skip),
        });
        const count = await ctx.prisma.membership.count({
            where: { ...criteria, organizationId },
        });
        return {
            data: memberships,
            count,
        };
    },
});
//# sourceMappingURL=memberships.js.map