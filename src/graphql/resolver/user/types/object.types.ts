import { objectType } from "nexus";
import { User } from "nexus-prisma";

export const UserObjectType = objectType({
  name: User.$name,
  definition(t) {
    t.string(User.id.name);
    t.string(User.name.name);
    t.string(User.email.name);
    t.string(User.phone.name);
  },
});
