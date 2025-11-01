import { TokenExpiredError } from "jsonwebtoken";
import {
  generateAccessToken,
  setAuthCookies,
  verifyAccessToken,
} from "lib/auth/jwt";
import { mutationField, nonNull, stringArg } from "nexus";

import { env } from "@/config";
import { findRequestUser } from "@/graphql/context";

import { LoginPayload } from "../types";

export const RefreshAccessToken = mutationField("refreshAccessToken", {
  type: LoginPayload,
  args: { refreshToken: nonNull(stringArg()) },
  resolve: async (_, { refreshToken }, ctx) => {
    try {
      const { userId } = verifyAccessToken(refreshToken);
      const ctxUser = await findRequestUser(userId);

      if (!ctxUser) throw new Error("Invalid user");

      const { accessToken, refreshToken: newRefreshToken } =
        generateAccessToken(ctxUser.user!.id!);
      setAuthCookies(ctx.res, true, accessToken);

      const { user: dbUser, hospital, rolekey } = ctxUser;

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          phone: dbUser.phone,
          roles: dbUser.roles,
          roleKey: rolekey,
          hospital,
        },
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
      };
    } catch (error) {
      const tokenExpires = error instanceof TokenExpiredError;
      if (tokenExpires) throw new Error("refresh token expired");
      throw new Error("Invalid refresh token");
    }
  },
});
