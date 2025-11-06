import { Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { env } from "@/config";

export type TokenPayload = {
  userId: string;
  refreshToken?: string | undefined;
};
export type LoginPayload = {
  jwtid: string;
  accessToken: string;
  refreshToken: string;
};

type JwtOptions = jwt.SignOptions;

const JWT_SECRET = String(env.JWT_SECRET);
const ONE_DAY_MS = 24 * 3600 * 1000;

const ACCESS_TOKEN_EXPIRE =
  (env.AUTH_TOKEN_EXPIRE as JwtOptions["expiresIn"]) || ONE_DAY_MS;
const REFRESH_TOKEN_EXPIRE =
  (env.REFRESH_TOKEN_EXPIRE as JwtOptions["expiresIn"]) || "7d";

const signToken = (payload: TokenPayload, options: JwtOptions): string => {
  return jwt.sign(payload, JWT_SECRET, options);
};

const signAccessToken = (
  { userId, refreshToken }: TokenPayload,
  jwtid: string
): string =>
  signToken(
    { userId, refreshToken },
    { expiresIn: ACCESS_TOKEN_EXPIRE, jwtid }
  );

const signRefreshToken = ({ userId }: TokenPayload, jwtid: string): string =>
  signToken({ userId }, { expiresIn: REFRESH_TOKEN_EXPIRE, jwtid });

export const generateAccessToken = async (
  userId: string
): Promise<LoginPayload> => {
  const jwtid = uuidv4();
  const accessToken = signAccessToken({ userId }, jwtid);
  const refreshToken = signRefreshToken({ userId }, jwtid);
  return { accessToken, refreshToken, jwtid };
};

export const verifyAccessToken = (
  token: string
): TokenPayload & jwt.JwtPayload =>
  jwt.verify(token, JWT_SECRET) as TokenPayload & jwt.JwtPayload;

const authCookieOptions = (secure = false) => ({
  httpOnly: true,
  expires: new Date(Date.now() + ONE_DAY_MS),
  maxAge: ONE_DAY_MS,
  secure,
  domain: env.COOKIE_DOMAIN,
});

export const setAuthCookies = (
  res: Response,
  secure: boolean,
  accessToken: string
): void => {
  res.cookie(env.AUTH_TOKEN_KEY, accessToken, authCookieOptions(secure));
};
