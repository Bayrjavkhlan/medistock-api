import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { EquipmentLogsObjectType, EquipmentLogsWhereInput } from "../types";

export const EquipmentLogs = queryField("equipmentLogs", {
  type: EquipmentLogsObjectType,
  args: {
    where: arg({ type: EquipmentLogsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parent, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "EquipmentLog");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { equipment: { name: { contains: search, mode: "insensitive" } } },
        { performedBy: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const equipmentLogs = await ctx.prisma.equipmentLog.findMany({
      where: criteria,
      skip,
      take,
      include: {
        equipment: {
          include: {
            hospital: true,
            assignedTo: true,
          },
        },
        performedBy: true,
      },
    });

    const count = await ctx.prisma.equipmentLog.count({
      where: criteria,
    });

    return {
      data: equipmentLogs,
      count,
    };
  },
});
