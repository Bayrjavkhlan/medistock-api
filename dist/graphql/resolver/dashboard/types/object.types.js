"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardOverviewObjectType = exports.PharmacyDashboardOverviewObjectType = exports.HospitalDashboardOverviewObjectType = exports.AdminDashboardOverviewObjectType = exports.DashboardProfileObjectType = exports.DashboardAlertItemObjectType = exports.DashboardActivityItemObjectType = exports.DashboardSeriesObjectType = exports.DashboardSeriesPointObjectType = exports.DashboardStatObjectType = void 0;
const nexus_1 = require("nexus");
const location_1 = require("../../location");
exports.DashboardStatObjectType = (0, nexus_1.objectType)({
    name: "DashboardStat",
    definition(t) {
        t.nonNull.string("label");
        t.nonNull.int("value");
        t.string("helper");
        t.string("tone");
    },
});
exports.DashboardSeriesPointObjectType = (0, nexus_1.objectType)({
    name: "DashboardSeriesPoint",
    definition(t) {
        t.nonNull.string("label");
        t.nonNull.int("value");
    },
});
exports.DashboardSeriesObjectType = (0, nexus_1.objectType)({
    name: "DashboardSeries",
    definition(t) {
        t.nonNull.string("key");
        t.nonNull.string("label");
        t.string("color");
        t.nonNull.list.nonNull.field("points", {
            type: exports.DashboardSeriesPointObjectType,
        });
    },
});
exports.DashboardActivityItemObjectType = (0, nexus_1.objectType)({
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
exports.DashboardAlertItemObjectType = (0, nexus_1.objectType)({
    name: "DashboardAlertItem",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("title");
        t.nonNull.string("description");
        t.nonNull.string("severity");
    },
});
exports.DashboardProfileObjectType = (0, nexus_1.objectType)({
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
exports.AdminDashboardOverviewObjectType = (0, nexus_1.objectType)({
    name: "AdminDashboardOverview",
    definition(t) {
        t.nonNull.list.nonNull.field("stats", { type: exports.DashboardStatObjectType });
        t.nonNull.list.nonNull.field("growthSeries", {
            type: exports.DashboardSeriesObjectType,
        });
        t.nonNull.list.nonNull.field("inventoryStatus", {
            type: exports.DashboardStatObjectType,
        });
        t.nonNull.list.nonNull.field("recentItems", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("topHospitals", {
            type: exports.DashboardStatObjectType,
        });
        t.nonNull.list.nonNull.field("topPharmacies", {
            type: exports.DashboardStatObjectType,
        });
        t.nonNull.list.nonNull.field("alerts", {
            type: exports.DashboardAlertItemObjectType,
        });
        t.nonNull.field("map", {
            type: location_1.AdminMapLocationsPayloadObjectType,
        });
    },
});
exports.HospitalDashboardOverviewObjectType = (0, nexus_1.objectType)({
    name: "HospitalDashboardOverview",
    definition(t) {
        t.nonNull.field("profile", { type: exports.DashboardProfileObjectType });
        t.nonNull.list.nonNull.field("stats", { type: exports.DashboardStatObjectType });
        t.nonNull.list.nonNull.field("activitySeries", {
            type: exports.DashboardSeriesObjectType,
        });
        t.nonNull.list.nonNull.field("equipmentStates", {
            type: exports.DashboardStatObjectType,
        });
        t.nonNull.list.nonNull.field("recentLogs", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("upcomingBookings", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("nearbyPharmacies", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("alerts", {
            type: exports.DashboardAlertItemObjectType,
        });
    },
});
exports.PharmacyDashboardOverviewObjectType = (0, nexus_1.objectType)({
    name: "PharmacyDashboardOverview",
    definition(t) {
        t.nonNull.field("profile", { type: exports.DashboardProfileObjectType });
        t.nonNull.list.nonNull.field("stats", { type: exports.DashboardStatObjectType });
        t.nonNull.list.nonNull.field("activitySeries", {
            type: exports.DashboardSeriesObjectType,
        });
        t.nonNull.list.nonNull.field("inventoryStatus", {
            type: exports.DashboardStatObjectType,
        });
        t.nonNull.list.nonNull.field("topDrugs", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("lowStockItems", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("recentUpdates", {
            type: exports.DashboardActivityItemObjectType,
        });
        t.nonNull.list.nonNull.field("alerts", {
            type: exports.DashboardAlertItemObjectType,
        });
    },
});
exports.DashboardOverviewObjectType = (0, nexus_1.objectType)({
    name: "DashboardOverview",
    definition(t) {
        t.string("role");
        t.field("admin", { type: exports.AdminDashboardOverviewObjectType });
        t.field("hospital", { type: exports.HospitalDashboardOverviewObjectType });
        t.field("pharmacy", { type: exports.PharmacyDashboardOverviewObjectType });
    },
});
//# sourceMappingURL=object.types.js.map