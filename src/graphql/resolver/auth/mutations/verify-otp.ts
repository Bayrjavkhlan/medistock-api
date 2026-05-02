import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import {
  assertValidEmail,
  OTP_MAX_VERIFY_ATTEMPTS,
} from "@/lib/auth/credentials";

import { VerifyOtpInput, VerifyOtpPayload } from "../types";

export const VerifyOtp = mutationField("verifyOtp", {
  type: VerifyOtpPayload,
  args: {
    input: nonNull(arg({ type: VerifyOtpInput })),
  },
  resolve: async (_parent, { input }, ctx) => {
    const email = assertValidEmail(input.email);
    const otp = input.otp.trim();

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw Errors.User.USER_NOT_FOUND();
    }

    if (user.emailVerified) {
      throw Errors.User.EMAIL_ALREADY_VERIFIED();
    }

    if (!user.otp || !user.otpExpiry) {
      throw Errors.Auth.INVALID_OTP();
    }

    if (new Date() > user.otpExpiry) {
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          otp: null,
          otpExpiry: null,
          otpAttempts: 0,
        },
      });

      throw Errors.Auth.OTP_EXPIRED();
    }

    if (user.otp !== otp) {
      const nextAttemptCount = user.otpAttempts + 1;

      if (nextAttemptCount >= OTP_MAX_VERIFY_ATTEMPTS) {
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: {
            otp: null,
            otpExpiry: null,
            otpAttempts: 0,
          },
        });

        throw Errors.Auth.TOO_MANY_OTP_ATTEMPTS();
      }

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          otpAttempts: nextAttemptCount,
        },
      });

      throw Errors.Auth.INVALID_OTP();
    }

    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
        otpLastSentAt: null,
      },
    });

    return {
      message: "И-мэйл хаяг амжилттай баталгаажлаа. Одоо нэвтэрч болно.",
    };
  },
});
