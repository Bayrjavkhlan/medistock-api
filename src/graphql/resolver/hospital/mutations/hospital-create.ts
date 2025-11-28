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

    const existing = await ctx.prisma.hospital.findFirst({
      where: {
        OR: [{ name }, email ? { email } : {}, phone ? { phone } : {}].filter(
          Boolean
        ),
      },
    });
    if (existing) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    await ctx.prisma.hospital.create({
      data: {
        name,
        email,
        phone,
        address: {
          create: {
            address1: address.address1,
            address2: address.address2 || null,
            province: address.province,
          },
        },
        createdBy: ctx.reqStaff?.staff?.id,
      },
    });
    return true;
  },
});
