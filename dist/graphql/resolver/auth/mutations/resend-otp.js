"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtp = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const credentials_1 = require("../../../../lib/auth/credentials");
const email_1 = require("../../../../lib/email");
const types_1 = require("../types");
exports.ResendOtp = (0, nexus_1.mutationField)("resendOtp", {
    type: types_1.ResendOtpPayload,
    args: {
        input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: types_1.ResendOtpInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
        const email = (0, credentials_1.assertValidEmail)(input.email);
        const user = await ctx.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw errors_1.Errors.User.USER_NOT_FOUND();
        }
        if (user.emailVerified) {
            throw errors_1.Errors.User.EMAIL_ALREADY_VERIFIED();
        }
        const remainingSeconds = (0, credentials_1.getOtpResendRemainingSeconds)(user.otpLastSentAt);
        if (remainingSeconds > 0) {
            throw errors_1.Errors.Auth.OTP_RESEND_TOO_SOON();
        }
        const otpState = (0, credentials_1.buildOtpState)();
        await ctx.prisma.user.update({
            where: { id: user.id },
            data: otpState,
        });
        try {
            await (0, email_1.sendOtpEmail)(email, otpState.otp);
        }
        catch {
            throw errors_1.Errors.System.INTERNAL_SERVER_ERROR();
        }
        return {
            message: "Баталгаажуулах кодыг дахин илгээлээ.",
        };
    },
});
//# sourceMappingURL=resend-otp.js.map