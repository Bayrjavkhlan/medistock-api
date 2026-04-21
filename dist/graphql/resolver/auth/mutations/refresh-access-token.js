"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const nexus_1 = require("nexus");
const config_1 = require("../../../../config");
const errors_1 = require("../../../../errors");
const context_1 = require("../../../../graphql/context");
const auth_1 = require("../../../../lib/auth");
const types_1 = require("../types");
exports.RefreshAccessToken = (0, nexus_1.mutationField)("refreshAccessToken", {
    type: types_1.LoginPayload,
    args: { refreshToken: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()) },
    resolve: async (_, { refreshToken }, ctx) => {
        try {
            const { userId } = (0, auth_1.verifyAccessToken)(refreshToken);
            const ctxUser = await (0, context_1.findRequestUser)(userId);
            if (!ctxUser || !ctxUser.user)
                throw errors_1.Errors.Auth.WRONG_USERNAME_PASSWORD();
            const { accessToken, refreshToken: newRefreshToken } = await (0, auth_1.generateAccessToken)(ctxUser.user.id);
            (0, auth_1.setAuthCookies)(ctx.res, config_1.env.NODE_ENV === "production", accessToken);
            return {
                user: ctxUser.user,
                accessToken,
                refreshToken: newRefreshToken,
                accessTokenExpiresAt: String(Date.now() + config_1.env.AUTH_TOKEN_EXPIRE),
            };
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError)
                throw errors_1.Errors.Auth.REFRESH_TOKEN_EXPIRED();
            throw errors_1.Errors.Auth.INVALID_REFRESH_TOKEN();
        }
    },
});
//# sourceMappingURL=refresh-access-token.js.map