"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const bcrypt_1 = require("bcrypt");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const credentials_1 = require("../../../../lib/auth/credentials");
const email_1 = require("../../../../lib/email");
const types_1 = require("../types");
exports.SignUp = (0, nexus_1.mutationField)("signUp", {
    type: types_1.SignUpPayload,
    args: {
        input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: types_1.SignUpInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
        const email = (0, credentials_1.assertValidEmail)(input.email);
        const password = (0, credentials_1.assertStrongPassword)(input.password);
        const name = (0, credentials_1.assertValidName)(input.name);
        const existingUser = await ctx.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser?.emailVerified) {
            throw errors_1.Errors.User.EMAIL_ALREADY_EXISTS();
        }
        const hashedPassword = await (0, bcrypt_1.hash)(password, 12);
        const otpState = (0, credentials_1.buildOtpState)();
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
        }
        else {
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
            await (0, email_1.sendOtpEmail)(email, otpState.otp);
        }
        catch {
            throw errors_1.Errors.System.INTERNAL_SERVER_ERROR();
        }
        return {
            message: "Бүртгэл амжилттай үүслээ. И-мэйл хаяг руу илгээсэн кодоор баталгаажуулна уу.",
        };
    },
});
//# sourceMappingURL=sign-up.js.map