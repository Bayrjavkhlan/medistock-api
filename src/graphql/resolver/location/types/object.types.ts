import { objectType } from "nexus";

export const DashboardMapLocationObjectType = objectType({
  name: "DashboardMapLocation",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("type");
    t.nonNull.string("address");
    t.string("address2");
    t.nonNull.string("province");
    t.nonNull.string("opensAt");
    t.nonNull.string("closesAt");
    t.nonNull.float("latitude");
    t.nonNull.float("longitude");
  },
});

export const AdminMapLocationsPayloadObjectType = objectType({
  name: "AdminMapLocationsPayload",
  definition(t) {
    t.nonNull.list.nonNull.field("hospitals", {
      type: DashboardMapLocationObjectType,
    });
    t.nonNull.list.nonNull.field("drugstores", {
      type: DashboardMapLocationObjectType,
    });
  },
});
