import { Organization, OrganizationRole } from "@prisma/client";
import { Request } from "express";

import { Errors } from "@/errors";

import { TUser } from "../context";

export type ActiveOrg = {
  role: OrganizationRole;
  organization: Organization;
};

export const resolveActiveOrg = (
  req: Request,
  reqUser: TUser | null
): ActiveOrg | null => {
  if (!reqUser?.user) return null;

  const headerOrgId = req.headers["x-org-id"];
  const orgId =
    typeof headerOrgId === "string" && headerOrgId.trim().length > 0
      ? headerOrgId.trim()
      : null;

  if (!orgId) return null;

  const membership = reqUser.user.memberships.find(
    (item) => item.organization.id === orgId
  );

  if (!membership) throw Errors.System.PERMISSION_DENIED();

  return {
    role: membership.role,
    organization: membership.organization,
  };
};
