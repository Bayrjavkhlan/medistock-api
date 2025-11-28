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
    });

    if (!hospital) {
      throw Errors.Hospital.HOSPITAL_NOT_FOUND;
    }

    const existing = await ctx.prisma.hospital.findFirst({
      where: {
        OR: [{ name }, email ? { email } : {}, phone ? { phone } : {}].filter(
          Boolean
        ),
      },
    });
    if (existing) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    await ctx.prisma.hospital.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address: {
          update: {
            address1: address.address1,
            address2: address.address2 || null,
            province: address.province,
          },
        },
        updatedBy: ctx.reqStaff?.staff?.id,
      },
    });

    return true;
  },
});
