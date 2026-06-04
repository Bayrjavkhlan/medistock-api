import { arg, nonNull, queryField, stringArg } from "nexus";

import { buildImagingAnalytics } from "../services/analytics.service";
import { ImagingDeviceAnalyticsObjectType } from "../types";

export const ImagingDeviceAnalytics = queryField("imagingDeviceAnalytics", {
  type: ImagingDeviceAnalyticsObjectType,
  args: {
    deviceSlug: nonNull(stringArg()),
    period: arg({ type: "String", default: "MONTHLY" }),
  },
  resolve: async (_parent, { deviceSlug, period }, ctx) =>
    buildImagingAnalytics(ctx, deviceSlug, (period ?? "MONTHLY") as any),
});
