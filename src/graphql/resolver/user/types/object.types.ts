import { objectType } from "nexus";

export const UserObjectType = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("email");
    t.string("name");
  },
});
