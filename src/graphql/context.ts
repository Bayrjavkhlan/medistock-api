import { Hospital, PrismaClient, Role, User } from "@prisma/client";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { env } from "@/config";
import { verifyAccessToken } from "@/lib/auth";
import { AppAbility, createAbilities } from "@/lib/casl";
import { prisma } from "@/lib/prisma";

export type TUser = {
  user: (User & { roles: Role[] }) | null;
  hospital: Hospital | null;
};

type CreateContext = {
  req: Request;
  res: Response;
};

export type Context = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  reqUser: TUser | null;
  caslAbility: AppAbility;
};

const verifyToken = (req: Request) => {
  const headerToken =
    req.headers.authorization && req.headers.authorization.split("Bearer ")[1];
  const token = req.cookies[env.AUTH_TOKEN_KEY] || headerToken;

  if (token) {
    try {
      const { userId } = verifyAccessToken(token);
      return userId;
    } catch (error) {
      const tokenExpires = error instanceof TokenExpiredError;
      if (tokenExpires) throw new Error("Access token has expired");
      throw new Error("Invalid access token");
    }
  }
  return undefined;
};

export const findRequestUser = async (
  userId?: string
): Promise<TUser | null> => {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      hospital: true,
      roles: true,
    },
  });
  if (!user) return null;

  return {
    user,
    hospital: user.hospital!,
  };
};

const createContext = async ({ req, res }: CreateContext): Promise<Context> => {
  const userId = verifyToken(req);
  const reqUser = await findRequestUser(userId);
  const caslAbility = createAbilities({ reqUser });

  return {
    req,
    res,
    prisma,
    reqUser,
    caslAbility,
  };
};

export { createContext };
