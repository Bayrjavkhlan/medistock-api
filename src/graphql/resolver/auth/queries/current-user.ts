import { queryField } from "nexus";

import { AuthUserObject } from "../types";

export const CurrentUser = queryField("currentUser", {
  type: AuthUserObject,
  resolve: async (_, __, ctx) => {
    if (!ctx.reqUser?.user) return null;

    return ctx.reqUser.user;
  },
});
