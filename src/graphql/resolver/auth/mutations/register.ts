import { hashSync } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { RegisterInput } from "../types";

export const Register = mutationField("register", {
  type: "Boolean",
  args: {
    input: nonNull(arg({ type: RegisterInput })),
  },
  resolve: async (_parent, { input }, ctx) => {
    const { email, password, name, phone } = input;

    const existing = await ctx.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
      },
    });

    if (existing) throw Errors.User.DUPLICATE_USER();

    await ctx.prisma.user.create({
      data: {
        email,
        password: hashSync(password, 10),
        name,
        phone: phone || null,
        isPlatformAdmin: false,
      },
    });

    return true;
  },
});
