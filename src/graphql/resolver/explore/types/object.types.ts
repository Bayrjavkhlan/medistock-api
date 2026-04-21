import { objectType } from "nexus";

export const PublicExploreMapItemObjectType = objectType({
  name: "PublicExploreMapItem",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("type");
    t.nonNull.string("address1");
    t.nullable.string("address2");
    t.nonNull.string("province");
    t.nullable.float("latitude");
    t.nullable.float("longitude");
  },
});
