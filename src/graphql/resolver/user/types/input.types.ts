import { EnumUserRoleType } from "@/graphql/typedef/enum.types";
import { inputObjectType } from "nexus";

export const UsersWhereInput = inputObjectType({
  name: "UsersWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.field("roleKey", { type: EnumUserRoleType });
  },
});
