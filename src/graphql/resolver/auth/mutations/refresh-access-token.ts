import { EnumStaffRole } from "@prisma/client";
import { TokenExpiredError } from "jsonwebtoken";
import { mutationField, nonNull, stringArg } from "nexus";

import { env } from "@/config";
import { Errors } from "@/errors";
import { findRequestStaff } from "@/graphql/context";
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
      const { staffId } = verifyAccessToken(refreshToken);
      const ctxStaff = await findRequestStaff(staffId);

      if (!ctxStaff || !ctxStaff.staff)
        throw Errors.Auth.WRONG_USERNAME_PASSWORD();

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessToken(ctxStaff.staff.id);

      setAuthCookies(ctx.res, true, accessToken);

      return {
        staff: {
          id: ctxStaff.staff.id,
          name: ctxStaff.staff.name,
          email: ctxStaff.staff.email,
          phone: ctxStaff.staff.phone,
          roles: ctxStaff.staff.roles,
          roleKey: ctxStaff.staff.roles[0]?.key as EnumStaffRole,
          hospital: ctxStaff.hospital,
        },
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
      };
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw Errors.Auth.REFRESH_TOKEN_EXPIRED();
      throw Errors.Auth.INVALID_REFRESH_TOKEN();
    }
  },
});
