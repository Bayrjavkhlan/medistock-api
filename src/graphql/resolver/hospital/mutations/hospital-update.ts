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
    const { name, email, phoneNumber, address } = input;

    const hospital = await ctx.prisma.hospital.findFirst({
      where: { id },
    });

    if (!hospital) {
      throw Errors.Hospital.HOSPITAL_NOT_FOUND;
    }

    const existing = await ctx.prisma.hospital.findFirst({
      where: {
        OR: [
          { name },
          email ? { email } : {},
          phoneNumber ? { phoneNumber } : {},
        ].filter(Boolean),
      },
    });
    if (existing) throw Errors.Hospital.DUPLICATE_HOSPITAL();

    await ctx.prisma.hospital.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        address: {
          update: {
            address1: address.address1,
            address2: address.address2 || null,
            province: address.province,
          },
        },
        updatedBy: ctx.reqUser?.user?.id,
      },
    });

    return true;
  },
});
