import { objectType } from "nexus";
import { Role } from "nexus-prisma";

import { EnumUserRoleType } from "@/graphql/typedef";

export const RoleObjectType = objectType({
  name: Role.$name,
  definition(t) {
    t.string(Role.id.name);
    t.field("key", { type: EnumUserRoleType });
    t.string(Role.name.name);
  },
});
