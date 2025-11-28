import { EnumStaffRole } from "@prisma/client";
import { arg, mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";
import { checkDuplicateStaff } from "@/utils/checkDuplicateStaff";

import { StaffCreateInput } from "../types";

export const StaffUpdate = mutationField("staffUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(arg({ type: StaffCreateInput })),
  },
  resolve: async (_, { id, input }, ctx) => {
    const staff = await ctx.prisma.staff.findFirst({
      where: { id },
    });

    if (!staff) {
      throw Errors.Staff.STAFF_NOT_FOUND();
    }

    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingStaff = await checkDuplicateStaff(ctx.prisma, email, phone);
    if (existingStaff) {
      throw Errors.Staff.DUPLICATED_STAFF_EMAIL;
    }

    await ctx.prisma.staff.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        roles: {
          set: [],
          connect: roleKeys.map((key: EnumStaffRole) => ({ key })),
        },
        ...(hospitalId && {
          hospital: { connect: { id: hospitalId } },
        }),
      },
    });

    return true;
  },
});
