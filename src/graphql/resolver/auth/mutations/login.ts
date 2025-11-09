import { EnumUserRole } from "@prisma/client";
import { compareSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
import { Errors } from "@/errors";
import { findRequestUser } from "@/graphql/context";
import { generateAccessToken, setAuthCookies } from "@/lib/auth";

import { LoginInput, LoginPayload } from "../types";

export const Login = mutationField("login", {
  type: LoginPayload,
  args: {
    input: nonNull(arg({ type: LoginInput })),
  },
  resolve: async (_, { input }, ctx) => {
    const { email, password } = input;

    const user = await ctx.prisma.user.findUnique({
      where: { email },
      include: { roles: true, hospital: true },
    });

    if (!user || !user.roles.length)
      throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const ctxUser = await findRequestUser(user.id);
    if (!ctxUser || !ctxUser.user) throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const { accessToken, refreshToken } = await generateAccessToken(user.id);
    setAuthCookies(ctx.res, true, accessToken);

    return {
      user: {
        id: ctxUser.user.id,
        email: ctxUser.user.email,
        name: ctxUser.user.name,
        phone: ctxUser.user.phone,
        roles: ctxUser.user.roles,
        roleKey: ctxUser.user.roles[0]?.key as EnumUserRole,
        hospital: ctxUser.hospital,
      },
      accessToken,
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
