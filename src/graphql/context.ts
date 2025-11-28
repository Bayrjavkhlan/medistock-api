import { Hospital, PrismaClient, Role, Staff } from "@prisma/client";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { env } from "@/config";
import { Errors } from "@/errors";
import { verifyAccessToken } from "@/lib/auth";
import { AppAbility, createAbilities } from "@/lib/casl";
import { prisma } from "@/lib/prisma";

export type TStaff = {
  staff: (Staff & { roles: Role[] }) | null;
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
  reqStaff: TStaff | null;
  caslAbility: AppAbility;
};

const verifyToken = (req: Request) => {
  const headerToken =
    req.headers.authorization && req.headers.authorization.split("Bearer ")[1];
  const token = req.cookies[env.AUTH_TOKEN_KEY] || headerToken;

  if (token) {
    try {
      const { staffId } = verifyAccessToken(token);
      return staffId;
    } catch (error) {
      const tokenExpires = error instanceof TokenExpiredError;
      if (tokenExpires) throw Errors.Auth.ACCESS_TOKEN_EXPIRED();
      throw Errors.Auth.INVALID_ACCESS_TOKEN();
    }
  }
  return undefined;
};

export const findRequestStaff = async (
  staffId?: string
): Promise<TStaff | null> => {
  if (!staffId) return null;
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      hospital: true,
      roles: true,
    },
  });
  if (!staff) return null;

  return {
    staff,
    hospital: staff.hospital!,
  };
};

const createContext = async ({ req, res }: CreateContext): Promise<Context> => {
  const staffId = verifyToken(req);
  const reqStaff = await findRequestStaff(staffId);
  const caslAbility = createAbilities({ reqStaff });

  return {
    req,
    res,
    prisma,
    reqStaff,
    caslAbility,
  };
};

export { createContext };
