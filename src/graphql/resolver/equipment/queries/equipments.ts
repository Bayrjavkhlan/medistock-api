import { Prisma } from "@prisma/client";
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

    if (ctx.reqUser?.user?.isPlatformAdmin) {
      const adminWhere = where?.search
        ? {
            OR: [
              {
                name: {
                  contains: where.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                serialNo: {
                  contains: where.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                assignedTo: {
                  is: {
                    name: {
                      contains: where.search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
              {
                hospital: {
                  is: {
                    organization: {
                      is: {
                        name: {
                          contains: where.search,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    },
                  },
                },
              },
            ],
          }
        : undefined;

      const equipments = await ctx.prisma.equipment.findMany({
        where: adminWhere,
        include: {
          hospital: {
            include: { organization: { include: { address: true } } },
          },
          logs: true,
          assignedTo: true,
        },
        skip,
        take,
      });
      const count = await ctx.prisma.equipment.count({
        where: adminWhere,
      });

      return {
        data: equipments,
        count,
      };
    }

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
              organization: {
                is: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
            },
          },
        },
      ];
    }

    const equipments = await ctx.prisma.equipment.findMany({
      where: criteria,
      include: {
        hospital: {
          include: { organization: { include: { address: true } } },
        },
        logs: true,
        assignedTo: true,
      },
      skip,
      take,
    });
    const count = await ctx.prisma.equipment.count({
      where: criteria,
    });

    return {
      data: equipments,
      count,
    };
  },
});
