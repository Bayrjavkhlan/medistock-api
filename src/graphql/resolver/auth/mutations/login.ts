import { compare } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
import { Errors } from "@/errors";
import { generateAccessToken, setAuthCookies } from "@/lib/auth";
import { normalizeEmail } from "@/lib/auth/credentials";

import { LoginInput, LoginPayload } from "../types";

export const Login = mutationField("login", {
  type: LoginPayload,
  args: {
    input: nonNull(arg({ type: LoginInput })),
  },
  resolve: async (_parent, { input }, ctx) => {
    const email = normalizeEmail(input.email);

    const user = await ctx.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      throw Errors.Auth.WRONG_USERNAME_PASSWORD();
    }

    if (!user.emailVerified) {
      throw Errors.Auth.EMAIL_NOT_VERIFIED();
    }

    const isPasswordValid = await compare(input.password, user.password);
    if (!isPasswordValid) {
      throw Errors.Auth.WRONG_USERNAME_PASSWORD();
    }

    const { accessToken, refreshToken } = await generateAccessToken(user.id);

    setAuthCookies(ctx.res, env.NODE_ENV === "production", accessToken);

    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
