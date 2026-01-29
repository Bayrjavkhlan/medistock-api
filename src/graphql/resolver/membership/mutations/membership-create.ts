import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { MembershipCreateInput } from "../types";

export const MembershipCreate = mutationField("membershipCreate", {
  type: "Boolean",
  args: {
    input: nonNull(MembershipCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    accessibleBy(ctx.caslAbility, "create", "Membership");

    const organizationId = ctx.activeOrg?.organization.id;
    if (!organizationId) throw Errors.System.PERMISSION_DENIED();

    const { userId, role } = input;

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw Errors.User.USER_NOT_FOUND();

    const existing = await ctx.prisma.membership.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
    });
    if (existing) throw Errors.Membership.DUPLICATE_MEMBERSHIP();

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
