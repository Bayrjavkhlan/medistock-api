import { hash } from "bcrypt";
import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import {
  assertStrongPassword,
  assertValidEmail,
  assertValidName,
  buildOtpState,
} from "@/lib/auth/credentials";
import { sendOtpEmail } from "@/lib/email";

import { SignUpInput, SignUpPayload } from "../types";

export const SignUp = mutationField("signUp", {
  type: SignUpPayload,
  args: {
    input: nonNull(arg({ type: SignUpInput })),
  },
  resolve: async (_parent, { input }, ctx) => {
    const email = assertValidEmail(input.email);
    const password = assertStrongPassword(input.password);
    const name = assertValidName(input.name);

    const existingUser = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser?.emailVerified) {
      throw Errors.User.EMAIL_ALREADY_EXISTS();
    }

    const hashedPassword = await hash(password, 12);
    const otpState = buildOtpState();

    if (existingUser) {
      await ctx.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email,
          name,
          password: hashedPassword,
          emailVerified: false,
          ...otpState,
        },
      });
    } else {
      await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          emailVerified: false,
          ...otpState,
        },
      });
    }

    try {
      await sendOtpEmail(email, otpState.otp);
    } catch {
      throw Errors.System.INTERNAL_SERVER_ERROR();
    }

    return {
      message:
        "Бүртгэл амжилттай үүслээ. И-мэйл хаяг руу илгээсэн кодоор баталгаажуулна уу.",
    };
  },
});
