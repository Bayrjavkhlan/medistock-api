import { EnumUserRoleType } from "@/graphql/typedef";
import { objectType } from "nexus";
import { Role } from "nexus-prisma";

export const RoleObjectType = objectType({
  name: Role.$name,
  definition(t) {
    t.string(Role.id.name);
    t.field("key", { type: EnumUserRoleType }); // expose the enum properly
    t.string(Role.name.name);
  },
});
