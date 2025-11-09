import { queryField } from "nexus";

import { CurrentUserObjectType } from "../types";

export const CurrentUser = queryField("currentUser", {
  type: CurrentUserObjectType,
  resolve: async (_, __, ctx) => {
    if (!ctx.reqUser?.user) return null;

    return {
      ...ctx.reqUser.user,
      hospital: ctx.reqUser.hospital,
      roleKey: ctx.reqUser.user.roles[0]?.key,
    };
  },
});
