import { inputObjectType } from "nexus";

import { OrganizationRoleEnum } from "@/graphql/typedef";

export const UsersWhereInput = inputObjectType({
  name: "UsersWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.string("organizationId");
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.string("phone");
    t.string("name");
    t.nonNull.string("password");
    t.boolean("isPlatformAdmin");
    t.string("organizationId");
    t.field("role", { type: OrganizationRoleEnum });
  },
});

export const UserUpdateInput = inputObjectType({
  name: "UserUpdateInput",
  definition: (t) => {
    t.string("email");
    t.string("phone");
    t.string("name");
    t.string("password");
    t.boolean("isPlatformAdmin");
    t.string("organizationId");
    t.field("role", { type: OrganizationRoleEnum });
  },
});
