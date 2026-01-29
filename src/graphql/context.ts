import {
  Organization,
  OrganizationRole,
  PrismaClient,
  User,
} from "@prisma/client";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { env } from "@/config";
import { Errors } from "@/errors";
import { resolveActiveOrg } from "@/graphql/middleware/withOrg";
import { verifyAccessToken } from "@/lib/auth";
import { AppAbility, createAbilities } from "@/lib/casl";
import { prisma } from "@/lib/prisma";

export type TUser = {
  user:
    | (User & {
        isPlatformAdmin: boolean;
        memberships: {
          role: OrganizationRole;
          organization: Organization;
        }[];
      })
    | null;
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
  activeOrg: {
    role: OrganizationRole;
    organization: Organization;
  } | null;
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
      if (tokenExpires) throw Errors.Auth.ACCESS_TOKEN_EXPIRED();
      throw Errors.Auth.INVALID_ACCESS_TOKEN();
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
      memberships: {
        include: {
          organization: {
            include: {
              hospital: true,
              pharmacy: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  return {
    user,
  };
};

const createContext = async ({ req, res }: CreateContext): Promise<Context> => {
  const userId = verifyToken(req);
  const reqUser = await findRequestUser(userId);

  const activeOrg = resolveActiveOrg(req, reqUser);

  const caslAbility = createAbilities({ reqUser, activeOrg });

  return {
    req,
    res,
    prisma,
    reqUser,
    activeOrg,
    caslAbility,
  };
};

export { createContext };
