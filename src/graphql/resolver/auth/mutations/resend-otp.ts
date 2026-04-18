import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";
import {
  assertValidEmail,
  buildOtpState,
  getOtpResendRemainingSeconds,
} from "@/lib/auth/credentials";
import { sendOtpEmail } from "@/lib/email";

import { ResendOtpInput, ResendOtpPayload } from "../types";

export const ResendOtp = mutationField("resendOtp", {
  type: ResendOtpPayload,
  args: {
    input: nonNull(arg({ type: ResendOtpInput })),
  },
  resolve: async (_parent, { input }, ctx) => {
    const email = assertValidEmail(input.email);

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw Errors.User.USER_NOT_FOUND();
    }

    if (user.emailVerified) {
      throw Errors.User.EMAIL_ALREADY_VERIFIED();
    }

    const remainingSeconds = getOtpResendRemainingSeconds(user.otpLastSentAt);
    if (remainingSeconds > 0) {
      throw Errors.Auth.OTP_RESEND_TOO_SOON();
    }

    const otpState = buildOtpState();

    await ctx.prisma.user.update({
      where: { id: user.id },
      data: otpState,
    });

    try {
      await sendOtpEmail(email, otpState.otp);
    } catch {
      throw Errors.System.INTERNAL_SERVER_ERROR();
    }

    return {
      message: "Баталгаажуулах кодыг дахин илгээлээ.",
    };
  },
});
