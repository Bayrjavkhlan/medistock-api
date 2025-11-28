import { objectType } from "nexus";
import { Role, Staff } from "nexus-prisma";

import { EnumStaffRoleType } from "@/graphql/typedef";

import { HospitalObjectType } from "../../hospital";

export const LoginPayload = objectType({
  name: "LoginPayload",
  definition: (t) => {
    t.nonNull.field("staff", { type: CurrentStaffObjectType });
    t.nonNull.string("accessToken");
    t.nonNull.string("refreshToken");
    t.nonNull.string("accessTokenExpiresAt");
  },
});

export const CurrentStaffObjectType = objectType({
  name: "CurrentStaffObjectType",
  definition: (t) => {
    t.field(Staff.id.name, { type: Staff.id.type });
    t.field(Staff.name.name, { type: Staff.name.type });
    t.field(Staff.email.name, { type: Staff.email.type });
    t.field(Staff.phone.name, { type: Staff.phone.type });
    t.list.nonNull.field(Staff.roles.name, { type: RoleObjectType });
    t.field("roleKey", { type: EnumStaffRoleType });
    t.nullable.field(Staff.hospital.name, { type: HospitalObjectType });
  },
});

export const RoleObjectType = objectType({
  name: Role.$name,
  definition(t) {
    t.string(Role.id.name);
    t.field("key", { type: EnumStaffRoleType });
    t.string(Role.name.name);
  },
});
