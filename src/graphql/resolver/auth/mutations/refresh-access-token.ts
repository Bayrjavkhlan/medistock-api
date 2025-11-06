import { EnumUserRole } from "@prisma/client";
import { TokenExpiredError } from "jsonwebtoken";
import { mutationField, nonNull, stringArg } from "nexus";

import { env } from "@/config";
import { findRequestUser } from "@/graphql/context";
import {
  generateAccessToken,
  setAuthCookies,
  verifyAccessToken,
} from "@/lib/auth";

import { LoginPayload } from "../types";

export const RefreshAccessToken = mutationField("refreshAccessToken", {
  type: LoginPayload,
  args: { refreshToken: nonNull(stringArg()) },
  resolve: async (_, { refreshToken }, ctx) => {
    try {
      const { userId } = verifyAccessToken(refreshToken);
      const ctxUser = await findRequestUser(userId);

      if (!ctxUser || !ctxUser.user) throw new Error("Invalid user context");

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessToken(ctxUser.user.id);

      setAuthCookies(ctx.res, true, accessToken);

      return {
        user: {
          id: ctxUser.user.id,
          email: ctxUser.user.email,
          name: ctxUser.user.name,
          phone: ctxUser.user.phone,
          roles: ctxUser.user.roles,
          roleKey: ctxUser.user.roles[0]?.name as EnumUserRole,
          hospital: ctxUser.hospital,
        },
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
      };
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new Error("Refresh token expired");
      throw new Error("Invalid refresh token");
    }
  },
});
