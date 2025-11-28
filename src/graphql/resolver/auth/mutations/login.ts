import { EnumStaffRole } from "@prisma/client";
import { compareSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
import { Errors } from "@/errors";
import { findRequestStaff } from "@/graphql/context";
import { generateAccessToken, setAuthCookies } from "@/lib/auth";

import { LoginInput, LoginPayload } from "../types";

export const Login = mutationField("login", {
  type: LoginPayload,
  args: {
    input: nonNull(arg({ type: LoginInput })),
  },
  resolve: async (_, { input }, ctx) => {
    const { email, password } = input;

    const staff = await ctx.prisma.staff.findUnique({
      where: { email },
      include: { roles: true, hospital: true },
    });

    if (!staff || !staff.roles.length)
      throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const isPasswordValid = compareSync(password, staff.password);
    if (!isPasswordValid) throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const ctxStaff = await findRequestStaff(staff.id);
    if (!ctxStaff || !ctxStaff.staff)
      throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const { accessToken, refreshToken } = await generateAccessToken(staff.id);
    setAuthCookies(ctx.res, true, accessToken);

    return {
      staff: {
        id: ctxStaff.staff.id,
        email: ctxStaff.staff.email,
        name: ctxStaff.staff.name,
        phone: ctxStaff.staff.phone,
        roles: ctxStaff.staff.roles,
        roleKey: ctxStaff.staff.roles[0]?.key as EnumStaffRole,
        hospital: ctxStaff.hospital,
      },
      accessToken,
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
