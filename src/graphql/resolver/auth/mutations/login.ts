import { compareSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { env } from "@/config";
import { findRequestUser } from "@/graphql/context";
import { generateAccessToken, setAuthCookies } from "@/lib/auth/jwt";

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
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await compareSync(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const ctxUser = await findRequestUser(user.id);
    if (!ctxUser) throw new Error("Invalid email or password");

    const { accessToken, refreshToken } = await generateAccessToken(user.id);
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
      refreshToken,
      accessTokenExpiresAt: String(Date.now() + env.AUTH_TOKEN_EXPIRE),
    };
  },
});
