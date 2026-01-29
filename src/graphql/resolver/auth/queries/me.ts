import { queryField } from "nexus";

import { MePayload } from "../types";

export const Me = queryField("me", {
  type: MePayload,
  resolve: async (_parent, _args, ctx) => {
    if (!ctx.reqUser?.user) return null;

    return {
      user: ctx.reqUser.user,
      activeOrganization: ctx.activeOrg
        ? {
            role: ctx.activeOrg.role,
            organization: ctx.activeOrg.organization,
          }
        : null,
    };
  },
});
