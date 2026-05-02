import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

export const MembershipDelete = mutationField("membershipDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "delete", "Membership");

    const organizationId = ctx.activeOrg?.organization.id;
    if (!organizationId) throw Errors.System.PERMISSION_DENIED();

    const membership = await ctx.prisma.membership.findFirst({
      where: {
        id,
        organizationId,
        ...criteria,
      },
    });
    if (!membership) throw Errors.Membership.MEMBERSHIP_NOT_FOUND();

    if (membership.role === "OWNER") {
      const ownersCount = await ctx.prisma.membership.count({
        where: { organizationId, role: "OWNER" },
      });
      if (ownersCount <= 1) throw Errors.Membership.LAST_OWNER();
    }

    await ctx.prisma.membership.delete({ where: { id } });

    return true;
  },
});
