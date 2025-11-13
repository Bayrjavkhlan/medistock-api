import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { HospitalObjectType } from "../types";

export const HospitalDetail = queryField("HospitalDetail", {
  type: HospitalObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Hospital");

    const hospital = await ctx.prisma.hospital.findFirst({
      where: {
        id,
        ...criteria,
      },
      include: { address: true },
    });

    if (!hospital) return null;

    return hospital;
  },
});
