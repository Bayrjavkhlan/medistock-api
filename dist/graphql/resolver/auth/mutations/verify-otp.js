"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtp = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const credentials_1 = require("../../../../lib/auth/credentials");
const types_1 = require("../types");
exports.VerifyOtp = (0, nexus_1.mutationField)("verifyOtp", {
    type: types_1.VerifyOtpPayload,
    args: {
        input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: types_1.VerifyOtpInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
        const email = (0, credentials_1.assertValidEmail)(input.email);
        const otp = input.otp.trim();
        const user = await ctx.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw errors_1.Errors.User.USER_NOT_FOUND();
        }
        if (user.emailVerified) {
            throw errors_1.Errors.User.EMAIL_ALREADY_VERIFIED();
        }
        if (!user.otp || !user.otpExpiry) {
            throw errors_1.Errors.Auth.INVALID_OTP();
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
            throw errors_1.Errors.Auth.OTP_EXPIRED();
        }
        if (user.otp !== otp) {
            const nextAttemptCount = user.otpAttempts + 1;
            if (nextAttemptCount >= credentials_1.OTP_MAX_VERIFY_ATTEMPTS) {
                await ctx.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        otp: null,
                        otpExpiry: null,
                        otpAttempts: 0,
                    },
                });
                throw errors_1.Errors.Auth.TOO_MANY_OTP_ATTEMPTS();
            }
            await ctx.prisma.user.update({
                where: { id: user.id },
                data: {
                    otpAttempts: nextAttemptCount,
                },
            });
            throw errors_1.Errors.Auth.INVALID_OTP();
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
//# sourceMappingURL=verify-otp.js.map