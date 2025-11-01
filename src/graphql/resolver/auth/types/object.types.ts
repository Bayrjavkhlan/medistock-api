import { objectType } from "nexus";
import { Role, User } from "nexus-prisma";

import { EnumUserRoleType } from "@/graphql/typedef";

import { HospitalObjectType } from "../../hospital";

export const LoginPayload = objectType({
  name: "LoginPayload",
  definition: (t) => {
    t.nonNull.field("user", { type: CurrentUserObjectType });
    t.nonNull.string("accessToken");
    t.nonNull.string("refreshToken");
    t.nonNull.string("accessTokenExpiresAt");
  },
});

export const CurrentUserObjectType = objectType({
  name: "CurrentUserObjectType",
  definition: (t) => {
    t.field(User.id.name, { type: User.id.type });
    t.field(User.name.name, { type: User.name.type });
    t.field(User.email.name, { type: User.email.type });
    t.field(User.phone.name, { type: User.phone.type });
    t.list.nonNull.field(User.roles.name, { type: RoleObjectType });
    t.field("roleKey", { type: EnumUserRoleType });
    t.nullable.field(User.hospital.name, { type: HospitalObjectType });
  },
});

export const RoleObjectType = objectType({
  name: Role.$name,
  definition(t) {
    t.string(Role.id.name);
    t.field("key", { type: EnumUserRoleType });
    t.string(Role.name.name);
  },
});
