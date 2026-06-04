import { arg, mutationField, nonNull, stringArg } from "nexus";

import { generateAnalyticsReport } from "../services/analytics.service";
import { AnalyticsReportPayloadObjectType } from "../types";

export const GenerateAnalyticsReport = mutationField(
  "generateAnalyticsReport",
  {
    type: AnalyticsReportPayloadObjectType,
    args: {
      deviceSlug: nonNull(stringArg()),
      period: arg({ type: "String", default: "MONTHLY" }),
    },
    resolve: async (_parent, { deviceSlug, period }, ctx) =>
      generateAnalyticsReport(ctx, deviceSlug, (period ?? "MONTHLY") as any),
  }
);
