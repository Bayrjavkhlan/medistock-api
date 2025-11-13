import { list, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { HospitalOptionObjectType } from "../types";

export const HospitalOption = queryField("hospitalOption", {
  type: nonNull(list(nonNull(HospitalOptionObjectType))),
  resolve: async (_parents, _args, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Hospital");

    const hospitals = await ctx.prisma.hospital.findMany({
      where: criteria,
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return hospitals;
  },
});
