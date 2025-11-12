import { objectType } from "nexus";
import { User } from "nexus-prisma";

import { RoleObjectType } from "@/graphql/resolver/auth";
import { HospitalObjectType } from "@/graphql/resolver/hospital";

export const UserObjectType = objectType({
  name: User.$name,
  definition(t) {
    t.string(User.id.name);
    t.string(User.name.name);
    t.string(User.email.name);
    t.string(User.phone.name);
    t.list.field(User.roles.name, { type: RoleObjectType });

    t.nullable.field(User.hospital.name, { type: HospitalObjectType });

    t.dateTime(User.createdAt.name);
    t.dateTime(User.updatedAt.name);
  },
});

export const UsersObjectType = objectType({
  name: "UserObjectType",
  definition(t) {
    t.list.nonNull.field("data", { type: UserObjectType });
    t.nonNull.int("count");
  },
});
