import { Organization, OrganizationRole } from "@prisma/client";
import { Request } from "express";
import { TUser } from "../context";
export type ActiveOrg = {
    role: OrganizationRole;
    organization: Organization;
};
export declare const resolveActiveOrg: (req: Request, reqUser: TUser | null) => ActiveOrg | null;
//# sourceMappingURL=withOrg.d.ts.map