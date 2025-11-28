import { nonNull, queryField, stringArg } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { StaffObjectType } from "../types/object.types";

export const StaffDetail = queryField("staffDetail", {
  type: StaffObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, { id }, ctx) => {
    const staff = await ctx.prisma.staff.findFirst({
      where: {
        id,
        ...accessibleBy(ctx.caslAbility, "read", "Staff"),
      },
      include: { roles: true, hospital: true },
    });

    if (!staff) return null;

    return {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      roles: staff.roles,
      hospital: staff.hospital,
    };
  },
});
