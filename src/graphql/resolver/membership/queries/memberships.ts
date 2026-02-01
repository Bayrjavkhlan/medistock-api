import { intArg, nonNull, queryField } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { MembershipsObjectType } from "../types";

export const Memberships = queryField("memberships", {
  type: MembershipsObjectType,
  args: {
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, { take, skip }, ctx) => {
    if (ctx.reqUser?.user?.isPlatformAdmin) {
      const memberships = await ctx.prisma.membership.findMany({
        include: { user: true, organization: true },
        ...pagination(take, skip),
      });

      return {
        data: memberships,
        count: memberships.length,
      };
    }

    const criteria = accessibleBy(ctx.caslAbility, "read", "Membership");

    const organizationId = ctx.activeOrg?.organization.id;
    if (!organizationId) {
      throw Errors.System.PERMISSION_DENIED();
    }

    const memberships = await ctx.prisma.membership.findMany({
      where: { ...criteria, organizationId },
      include: { user: true, organization: true },
      ...pagination(take, skip),
    });

    return {
      data: memberships,
      count: memberships.length,
    };
  },
});
