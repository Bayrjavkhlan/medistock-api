import { queryField } from "nexus";

import { buildPredictiveMaintenance } from "../services/analytics.service";
import { PredictiveMaintenanceDashboardObjectType } from "../types";

export const PredictiveMaintenance = queryField("predictiveMaintenance", {
  type: PredictiveMaintenanceDashboardObjectType,
  resolve: async (_parent, _args, ctx) => buildPredictiveMaintenance(ctx),
});
