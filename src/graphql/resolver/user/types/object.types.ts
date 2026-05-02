import { objectType } from "nexus";
import { User } from "nexus-prisma";

export const UserObjectType = objectType({
  name: User.$name,
  definition(t) {
    t.string(User.id.name);
    t.string(User.name.name);
    t.string(User.email.name);
    t.string(User.phone.name);
    t.boolean(User.isPlatformAdmin.name);
    t.dateTime(User.createdAt.name);
    t.dateTime(User.updatedAt.name);
  },
});

export const UsersObjectType = objectType({
  name: UserObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: UserObjectType });
    t.nonNull.int("count");
  },
});
