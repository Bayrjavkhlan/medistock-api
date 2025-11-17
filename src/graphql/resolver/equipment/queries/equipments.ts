import { arg, intArg, nonNull, queryField } from "nexus";

import { accessibleBy } from "@/lib/casl";

import { EquipementsObjectType, EquipmentsWhereInput } from "../types";

export const Equipments = queryField("equipments", {
  type: EquipementsObjectType,
  args: {
    where: arg({ type: EquipmentsWhereInput }),
    take: nonNull(intArg()),
    skip: nonNull(intArg()),
  },
  resolve: async (_parents, _args, ctx) => {
    const { where, take, skip } = _args;

    const criteria = accessibleBy(ctx.caslAbility, "read", "Equipment");

    if (where?.search) {
      const search = where.search;
      criteria.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { serialNo: { contains: search, mode: "insensitive" } },
        {
          assignedTo: {
            is: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          hospital: {
            is: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const equipments = await ctx.prisma.equipment.findMany({
      where: criteria,
      include: { hospital: true, logs: true, assignedTo: true },
      skip,
      take,
    });

    return {
      data: equipments,
      count: equipments.length,
    };
  },
});
