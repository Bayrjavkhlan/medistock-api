import { OrganizationType } from "@prisma/client";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { HospitalCreateInput } from "../types";

export const HospitalUpdate = mutationField("hospitalUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(HospitalCreateInput),
  },
  resolve: async (_, { id, input }, ctx) => {
    const { name, email, phone, address } = input;

    const hospital = await ctx.prisma.hospital.findFirst({
      where: { id },
      include: { organization: true },
    });

    if (!hospital) {
      throw Errors.Hospital.HOSPITAL_NOT_FOUND();
    }

    const existingOrg = await ctx.prisma.organization.findFirst({
      where: {
        id: { not: hospital.organizationId },
        name,
        type: OrganizationType.HOSPITAL,
      },
    });
    if (existingOrg) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    const existingContact = await ctx.prisma.hospital.findFirst({
      where: {
        id: { not: id },
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });
    if (existingContact) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    await ctx.prisma.hospital.update({
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
                },
                update: {
                  address1: address.address1,
                  address2: address.address2 || null,
                  province: address.province,
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
