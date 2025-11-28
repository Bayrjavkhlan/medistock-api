import { EnumStaffRole } from "@prisma/client";
import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import { checkDuplicateStaff } from "@/utils/checkDuplicateStaff";
import { generatePassword } from "@/utils/generatePassword";

import { StaffCreateInput } from "../types";

export const staffCreate = mutationField("staffCreate", {
  type: "Boolean",
  args: {
    input: nonNull(arg({ type: StaffCreateInput })),
  },
  resolve: async (_, { input }, ctx) => {
    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingstaff = await checkDuplicateStaff(ctx.prisma, email, phone);
    if (existingstaff) {
      throw Errors.Staff.DUPLICATED_STAFF_EMAIL();
    }

    const { password, passwordHashed } = generatePassword(email);

    console.log("password:\t", password);

    if (
      !ctx.reqStaff ||
      !ctx.reqStaff.staff ||
      !ctx.reqStaff.staff.roles[0]?.key
    ) {
      throw Errors.Auth.NOT_AUTHORIZED();
    }

    if (roleKeys.includes("ADMIN") || roleKeys.includes("HOSPITAL_ADMIN")) {
      if (ctx.reqStaff.staff.roles[0].key !== EnumStaffRole.ADMIN) {
        throw Errors.System.ACCESS_DENIED();
      }
    }

    await ctx.prisma.staff.create({
      data: {
        name,
        email,
        phone,
        password: passwordHashed,
        roles: {
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
