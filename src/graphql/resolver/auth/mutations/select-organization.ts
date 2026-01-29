import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { UserMembershipObject } from "../types";

export const SelectOrganization = mutationField("selectOrganization", {
  type: UserMembershipObject,
  args: {
    orgId: nonNull(stringArg()),
  },
  resolve: async (_parent, { orgId }, ctx) => {
    if (!ctx.reqUser?.user) throw Errors.Auth.NOT_AUTHORIZED();

    const membership = ctx.reqUser.user.memberships.find(
      (item) => item.organization.id === orgId
    );
    if (!membership) throw Errors.System.PERMISSION_DENIED();

    ctx.res.setHeader("x-org-id", orgId);
    ctx.res.cookie("x-org-id", orgId, { sameSite: "lax" });

    return membership;
  },
});
