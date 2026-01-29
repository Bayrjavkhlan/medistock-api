import { compareSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
import { Errors } from "@/errors";
import { generateAccessToken, setAuthCookies } from "@/lib/auth";

import { LoginInput, LoginPayload } from "../types";

export const Login = mutationField("login", {
  type: LoginPayload,
  args: {
    input: nonNull(arg({ type: LoginInput })),
  },
  resolve: async (_, { input }, ctx) => {
    const { email, password } = input;

    const user = await ctx.prisma.user.findFirst({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !user.password) throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) throw Errors.Auth.WRONG_USERNAME_PASSWORD();

    const { accessToken, refreshToken } = await generateAccessToken(user.id);

    setAuthCookies(ctx.res, true, accessToken);

    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
