"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const bcrypt_1 = require("bcrypt");
const nexus_1 = require("nexus");
const config_1 = require("../../../../config");
const errors_1 = require("../../../../errors");
const auth_1 = require("../../../../lib/auth");
const credentials_1 = require("../../../../lib/auth/credentials");
const types_1 = require("../types");
exports.Login = (0, nexus_1.mutationField)("login", {
    type: types_1.LoginPayload,
    args: {
        input: (0, nexus_1.nonNull)((0, nexus_1.arg)({ type: types_1.LoginInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
        const email = (0, credentials_1.normalizeEmail)(input.email);
        const user = await ctx.prisma.user.findUnique({
            where: { email },
            include: {
                memberships: {
                    include: {
                        organization: true,
                    },
                },
            },
        });
        if (!user || !user.password) {
            throw errors_1.Errors.Auth.WRONG_USERNAME_PASSWORD();
        }
        if (!user.emailVerified) {
            throw errors_1.Errors.Auth.EMAIL_NOT_VERIFIED();
        }
        const isPasswordValid = await (0, bcrypt_1.compare)(input.password, user.password);
        if (!isPasswordValid) {
            throw errors_1.Errors.Auth.WRONG_USERNAME_PASSWORD();
        }
        const { accessToken, refreshToken } = await (0, auth_1.generateAccessToken)(user.id);
        (0, auth_1.setAuthCookies)(ctx.res, config_1.env.NODE_ENV === "production", accessToken);
        return {
            user,
            accessToken,
            refreshToken,
            accessTokenExpiresAt: String(Date.now() + config_1.env.AUTH_TOKEN_EXPIRE),
        };
    },
});
//# sourceMappingURL=login.js.map