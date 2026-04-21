import { objectType } from "nexus";

import { AdminMapLocationsPayloadObjectType } from "../../location";

export const DashboardStatObjectType = objectType({
  name: "DashboardStat",
  definition(t) {
    t.nonNull.string("label");
    t.nonNull.int("value");
    t.string("helper");
    t.string("tone");
  },
});

export const DashboardSeriesPointObjectType = objectType({
  name: "DashboardSeriesPoint",
  definition(t) {
    t.nonNull.string("label");
    t.nonNull.int("value");
  },
});

export const DashboardSeriesObjectType = objectType({
  name: "DashboardSeries",
  definition(t) {
    t.nonNull.string("key");
    t.nonNull.string("label");
    t.string("color");
    t.nonNull.list.nonNull.field("points", {
      type: DashboardSeriesPointObjectType,
    });
  },
});

export const DashboardActivityItemObjectType = objectType({
  name: "DashboardActivityItem",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.string("subtitle");
    t.string("meta");
    t.string("href");
    t.string("createdAt");
  },
});

export const DashboardAlertItemObjectType = objectType({
  name: "DashboardAlertItem",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("severity");
  },
});

export const DashboardProfileObjectType = objectType({
  name: "DashboardProfile",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.string("email");
    t.string("phone");
    t.nonNull.string("address");
    t.string("province");
    t.float("latitude");
    t.float("longitude");
  },
});

export const AdminDashboardOverviewObjectType = objectType({
  name: "AdminDashboardOverview",
  definition(t) {
    t.nonNull.list.nonNull.field("stats", { type: DashboardStatObjectType });
    t.nonNull.list.nonNull.field("growthSeries", {
      type: DashboardSeriesObjectType,
    });
    t.nonNull.list.nonNull.field("inventoryStatus", {
      type: DashboardStatObjectType,
    });
    t.nonNull.list.nonNull.field("recentItems", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("topHospitals", {
      type: DashboardStatObjectType,
    });
    t.nonNull.list.nonNull.field("topPharmacies", {
      type: DashboardStatObjectType,
    });
    t.nonNull.list.nonNull.field("alerts", {
      type: DashboardAlertItemObjectType,
    });
    t.nonNull.field("map", {
      type: AdminMapLocationsPayloadObjectType,
    });
  },
});

export const HospitalDashboardOverviewObjectType = objectType({
  name: "HospitalDashboardOverview",
  definition(t) {
    t.nonNull.field("profile", { type: DashboardProfileObjectType });
    t.nonNull.list.nonNull.field("stats", { type: DashboardStatObjectType });
    t.nonNull.list.nonNull.field("activitySeries", {
      type: DashboardSeriesObjectType,
    });
    t.nonNull.list.nonNull.field("equipmentStates", {
      type: DashboardStatObjectType,
    });
    t.nonNull.list.nonNull.field("recentLogs", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("upcomingBookings", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("nearbyPharmacies", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("alerts", {
      type: DashboardAlertItemObjectType,
    });
  },
});

export const PharmacyDashboardOverviewObjectType = objectType({
  name: "PharmacyDashboardOverview",
  definition(t) {
    t.nonNull.field("profile", { type: DashboardProfileObjectType });
    t.nonNull.list.nonNull.field("stats", { type: DashboardStatObjectType });
    t.nonNull.list.nonNull.field("activitySeries", {
      type: DashboardSeriesObjectType,
    });
    t.nonNull.list.nonNull.field("inventoryStatus", {
      type: DashboardStatObjectType,
    });
    t.nonNull.list.nonNull.field("topDrugs", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("lowStockItems", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("recentUpdates", {
      type: DashboardActivityItemObjectType,
    });
    t.nonNull.list.nonNull.field("alerts", {
      type: DashboardAlertItemObjectType,
    });
  },
});

export const DashboardOverviewObjectType = objectType({
  name: "DashboardOverview",
  definition(t) {
    t.string("role");
    t.field("admin", { type: AdminDashboardOverviewObjectType });
    t.field("hospital", { type: HospitalDashboardOverviewObjectType });
    t.field("pharmacy", { type: PharmacyDashboardOverviewObjectType });
  },
});
