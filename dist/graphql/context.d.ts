import { Organization, OrganizationRole, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { AppAbility } from "../lib/casl";
export type TUser = {
    user: (User & {
        isPlatformAdmin: boolean;
        memberships: {
            role: OrganizationRole;
            organization: Organization;
        }[];
    }) | null;
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
export declare const findRequestUser: (userId?: string) => Promise<TUser | null>;
declare const createContext: ({ req, res }: CreateContext) => Promise<Context>;
export { createContext };
//# sourceMappingURL=context.d.ts.map