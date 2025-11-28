import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";
import { pagination } from "@/lib/prisma";

import { HospitalsObjectType, HospitalsWhereInput } from "../types";

export const Hospitals = queryField("hospitals", {
  type: HospitalsObjectType,
  args: {
    where: arg({ type: HospitalsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "Hospital");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (where?.address) {
      // todo filter by address
    }
    const hospitals = await ctx.prisma.hospital.findMany({
      where: criteria,
      include: { address: true },
      ...pagination(take, skip),
    });
    return {
      data: hospitals,
      count: hospitals.length,
    };
  },
});
