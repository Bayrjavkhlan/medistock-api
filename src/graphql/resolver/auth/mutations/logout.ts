import { mutationField } from "nexus";

import { clearAuthCookies } from "@/lib/auth";

import { LogoutPayload } from "../types";

export const Logout = mutationField("logout", {
  type: LogoutPayload,
  resolve: async (_parent, _args, ctx) => {
    clearAuthCookies(ctx.res);

    return {
      message: "Системээс амжилттай гарлаа.",
    };
  },
});
