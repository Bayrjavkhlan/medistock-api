import { EnumUserRoleType } from "@/graphql/typedef/enum.types";
import { inputObjectType } from "nexus";

export const UsersWhereInput = inputObjectType({
  name: "UsersWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.field("roleKey", { type: EnumUserRoleType });
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("phone");
    t.nonNull.list.nonNull.field("roleKeys", { type: EnumUserRoleType });
    t.nonNull.string("hospitalId");
  },
});
