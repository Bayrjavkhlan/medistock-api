import { OrganizationType } from "@prisma/client";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { validateAddressCoordinates } from "@/graphql/utils/addressCoordinates";

import { PharmacyUpdateInput } from "../types";

export const PharmacyUpdate = mutationField("pharmacyUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(PharmacyUpdateInput),
  },
  resolve: async (_parents, { id, input }, ctx) => {
    const { name, email, phone, address } = input;
    validateAddressCoordinates(address);

    const pharmacy = await ctx.prisma.pharmacy.findFirst({
      where: { id },
      include: { organization: true },
    });

    if (!pharmacy) {
      throw Errors.Pharmacy.PHARMACY_NOT_FOUND();
    }

    const existingOrg = await ctx.prisma.organization.findFirst({
      where: {
        id: { not: pharmacy.organizationId },
        name,
        type: OrganizationType.PHARMACY,
      },
    });
    if (existingOrg) throw Errors.Pharmacy.DUPLICATE_PHARMACY();

    const existingContact = await ctx.prisma.pharmacy.findFirst({
      where: {
        id: { not: id },
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });
    if (existingContact) throw Errors.Pharmacy.DUPLICATE_PHARMACY();

    await ctx.prisma.pharmacy.update({
      where: { id },
      data: {
        email,
        phone,
        organization: {
          update: {
            name,
            address: {
              upsert: {
                create: {
                  address1: address.address1,
                  address2: address.address2 || null,
                  province: address.province,
                  latitude: address.latitude ?? null,
                  longitude: address.longitude ?? null,
                },
                update: {
                  address1: address.address1,
                  address2: address.address2 || null,
                  province: address.province,
                  latitude: address.latitude ?? null,
                  longitude: address.longitude ?? null,
                },
              },
            },
          },
        },
      },
    });

    return true;
  },
});
