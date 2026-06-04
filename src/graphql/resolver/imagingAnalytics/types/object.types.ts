import { objectType } from "nexus";

export const AnalyticsPointObjectType = objectType({
  name: "AnalyticsPoint",
  definition(t) {
    t.nonNull.string("label");
    t.nonNull.float("value");
  },
});

export const ImagingUtilizationStatsObjectType = objectType({
  name: "ImagingUtilizationStats",
  definition(t) {
    t.nonNull.int("totalImages");
    t.nonNull.float("imagesPerHour");
    t.nonNull.float("imagesPerDay");
    t.nonNull.float("imagesPerWeek");
    t.nonNull.float("imagesPerMonth");
    t.nonNull.float("estimatedOperatingHours");
    t.nonNull.float("averageStudiesPerPatient");
    t.nonNull.float("utilizationPercentage");
  },
});

export const WorkloadAnalysisObjectType = objectType({
  name: "WorkloadAnalysis",
  definition(t) {
    t.nonNull.list.nonNull.field("hourly", { type: AnalyticsPointObjectType });
    t.nonNull.list.nonNull.field("daily", { type: AnalyticsPointObjectType });
    t.nonNull.list.nonNull.field("weekly", { type: AnalyticsPointObjectType });
    t.nonNull.list.nonNull.field("monthly", { type: AnalyticsPointObjectType });
    t.nonNull.string("busiestHour");
    t.nonNull.string("busiestDay");
    t.nonNull.list.nonNull.string("peakOperatingHours");
    t.nonNull.list.nonNull.string("lowestOperatingHours");
    t.nonNull.list.nonNull.string("underutilizedPeriods");
  },
});

export const DeviceHealthObjectType = objectType({
  name: "DeviceHealth",
  definition(t) {
    t.nonNull.string("level");
    t.nonNull.list.nonNull.string("reasons");
  },
});

export const RiskPredictionObjectType = objectType({
  name: "RiskPrediction",
  definition(t) {
    t.nonNull.string("label");
    t.nonNull.int("riskScore");
    t.nonNull.string("riskLevel");
    t.nonNull.string("recommendation");
  },
});

export const ImagingDeviceAnalyticsObjectType = objectType({
  name: "ImagingDeviceAnalytics",
  definition(t) {
    t.nonNull.string("deviceSlug");
    t.nonNull.string("deviceId");
    t.nonNull.string("deviceName");
    t.nonNull.string("hospital");
    t.nonNull.string("department");
    t.nonNull.string("period");
    t.nonNull.field("stats", { type: ImagingUtilizationStatsObjectType });
    t.nonNull.field("workload", { type: WorkloadAnalysisObjectType });
    t.nonNull.field("health", { type: DeviceHealthObjectType });
    t.nonNull.list.nonNull.field("predictions", {
      type: RiskPredictionObjectType,
    });
    t.nonNull.list.nonNull.string("recommendations");
  },
});

export const PredictiveMaintenanceDashboardObjectType = objectType({
  name: "PredictiveMaintenanceDashboard",
  definition(t) {
    t.nonNull.list.nonNull.field("devices", {
      type: ImagingDeviceAnalyticsObjectType,
    });
  },
});

export const AnalyticsReportPayloadObjectType = objectType({
  name: "AnalyticsReportPayload",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("deviceName");
    t.nonNull.string("period");
    t.nonNull.string("fileName");
    t.nonNull.string("pdfBase64");
    t.nonNull.dateTime("createdAt");
  },
});
