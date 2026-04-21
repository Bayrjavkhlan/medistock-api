import { OrganizationType } from "@prisma/client";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import { validateAddressCoordinates } from "@/graphql/utils/addressCoordinates";

import { PharmacyCreateInput } from "../types";

export const PharmacyCreate = mutationField("pharmacyCreate", {
  type: "Boolean",
  args: {
    input: nonNull(PharmacyCreateInput),
  },
  resolve: async (_parents, { input }, ctx) => {
    const { name, email, phone, address } = input;
    validateAddressCoordinates(address);

    const existingOrg = await ctx.prisma.organization.findFirst({
      where: { name, type: OrganizationType.PHARMACY },
    });
    if (existingOrg) throw Errors.Pharmacy.DUPLICATE_PHARMACY();

    const existingContact = await ctx.prisma.pharmacy.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });
    if (existingContact) throw Errors.Pharmacy.DUPLICATE_PHARMACY();

    await ctx.prisma.organization.create({
      data: {
        name,
        type: OrganizationType.PHARMACY,
        address: {
          create: {
            address1: address.address1,
            address2: address.address2 || null,
            province: address.province,
            latitude: address.latitude ?? null,
            longitude: address.longitude ?? null,
          },
        },
        pharmacy: {
          create: {
            email,
            phone,
          },
        },
      },
    });
    return true;
  },
});
