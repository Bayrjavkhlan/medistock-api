import { queryField } from "nexus";

import { CurrentStaffObjectType } from "../types";

export const CurrentStaff = queryField("currentStaff", {
  type: CurrentStaffObjectType,
  resolve: async (_, __, ctx) => {
    if (!ctx.reqStaff?.staff) return null;

    return {
      ...ctx.reqStaff.staff,
      hospital: ctx.reqStaff.hospital,
      roleKey: ctx.reqStaff.staff.roles[0]?.key,
    };
  },
});
