import { objectType } from "nexus";

import { OrganizationRoleEnum, OrganizationTypeEnum } from "@/graphql/typedef";
export const OrganizationSummary = objectType({
  name: "OrganizationSummary",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.field("type", { type: OrganizationTypeEnum });
  },
});

export const UserMembershipObject = objectType({
  name: "UserMembership",
  definition(t) {
    t.nonNull.field("role", { type: OrganizationRoleEnum });
    t.nonNull.field("organization", { type: OrganizationSummary });
  },
});

export const AuthUserObject = objectType({
  name: "AuthUser",
  definition(t) {
    t.nonNull.string("id");
    t.string("email");
    t.string("name");
    t.string("phone");
    t.nonNull.boolean("isPlatformAdmin");
    t.nonNull.list.nonNull.field("memberships", {
      type: UserMembershipObject,
    });
  },
});

export const MePayload = objectType({
  name: "MePayload",
  definition(t) {
    t.nonNull.field("user", { type: AuthUserObject });
    t.nullable.field("activeOrganization", { type: UserMembershipObject });
  },
});

export const LoginPayload = objectType({
  name: "LoginPayload",
  definition(t) {
    t.nonNull.field("user", { type: AuthUserObject });
    t.nonNull.string("accessToken");
    t.nonNull.string("refreshToken");
    t.nonNull.string("accessTokenExpiresAt");
  },
});
