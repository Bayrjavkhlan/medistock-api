import { Prisma } from "@prisma/client";
import { arg, list, nonNull, queryField } from "nexus";

import { PublicExploreMapItemObjectType } from "../types";

export const PublicExploreMap = queryField("publicExploreMap", {
  type: nonNull(list(nonNull(PublicExploreMapItemObjectType))),
  args: {
    search: arg({ type: "String" }),
  },
  resolve: async (_parent, args, ctx) => {
    const search = args.search?.trim();
    const searchWhere = search
      ? {
          OR: [
            {
              organization: {
                is: {
                  name: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
            {
              organization: {
                is: {
                  address: {
                    is: {
                      address1: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              },
            },
            {
              organization: {
                is: {
                  address: {
                    is: {
                      address2: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                },
              },
            },
            {
              organization: {
                is: {
                  address: {
                    is: {
                      province: {
                        contains: search,
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

    const [hospitals, pharmacies] = await Promise.all([
      ctx.prisma.hospital.findMany({
        where: searchWhere,
        include: { organization: { include: { address: true } } },
      }),
      ctx.prisma.pharmacy.findMany({
        where: searchWhere,
        include: { organization: { include: { address: true } } },
      }),
    ]);

    const hospitalItems = hospitals
      .filter((entry) => entry.organization.address)
      .map((entry) => ({
        id: entry.id,
        name: entry.organization.name,
        type: "HOSPITAL",
        address1: entry.organization.address!.address1,
        address2: entry.organization.address!.address2,
        province: entry.organization.address!.province,
        latitude: entry.organization.address!.latitude,
        longitude: entry.organization.address!.longitude,
      }));

    const pharmacyItems = pharmacies
      .filter((entry) => entry.organization.address)
      .map((entry) => ({
        id: entry.id,
        name: entry.organization.name,
        type: "PHARMACY",
        address1: entry.organization.address!.address1,
        address2: entry.organization.address!.address2,
        province: entry.organization.address!.province,
        latitude: entry.organization.address!.latitude,
        longitude: entry.organization.address!.longitude,
      }));

    return [...hospitalItems, ...pharmacyItems];
  },
});
