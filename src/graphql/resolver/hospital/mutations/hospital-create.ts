import { OrganizationType } from "@prisma/client";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { HospitalCreateInput } from "../types";

export const hospitalCreate = mutationField("hospitalCreate", {
  type: "Boolean",
  args: {
    input: nonNull(HospitalCreateInput),
  },
  resolve: async (_parents, { input }, ctx) => {
    const { name, email, phone, address } = input;

    const existingOrg = await ctx.prisma.organization.findFirst({
      where: { name, type: OrganizationType.HOSPITAL },
    });
    if (existingOrg) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    const existingContact = await ctx.prisma.hospital.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });
    if (existingContact) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    await ctx.prisma.organization.create({
      data: {
        name,
        type: OrganizationType.HOSPITAL,
        address: {
          create: {
            address1: address.address1,
            address2: address.address2 || null,
            province: address.province,
          },
        },
        hospital: {
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
