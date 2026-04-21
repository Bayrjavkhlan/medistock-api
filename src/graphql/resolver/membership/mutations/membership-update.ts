import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { MembershipUpdateInput } from "../types";

export const MembershipUpdate = mutationField("membershipUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(MembershipUpdateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "update", "Membership");

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

    if (membership.role === "OWNER" && input.role !== "OWNER") {
      const ownersCount = await ctx.prisma.membership.count({
        where: { organizationId, role: "OWNER" },
      });
      if (ownersCount <= 1) throw Errors.Membership.LAST_OWNER();
    }

    await ctx.prisma.membership.update({
      where: { id },
      data: { role: input.role },
    });

    return true;
  },
});
