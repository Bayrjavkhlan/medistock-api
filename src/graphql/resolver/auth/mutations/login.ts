import { EnumUserRole } from "@prisma/client";
import { compareSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
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
      throw new Error("Invalid email or password");

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const ctxUser = await findRequestUser(user.id);
    if (!ctxUser || !ctxUser.user) throw new Error("Invalid user context");

    const { accessToken, refreshToken } = await generateAccessToken(user.id);
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
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
