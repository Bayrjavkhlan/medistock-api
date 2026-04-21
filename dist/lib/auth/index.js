"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.verifyAccessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const config_1 = require("../../config");
const JWT_SECRET = String(config_1.env.JWT_SECRET);
const ONE_DAY_MS = 24 * 3600 * 1000;
const ACCESS_TOKEN_EXPIRE = config_1.env.AUTH_TOKEN_EXPIRE || ONE_DAY_MS;
const REFRESH_TOKEN_EXPIRE = config_1.env.REFRESH_TOKEN_EXPIRE || "7d";
const signToken = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
const signAccessToken = ({ userId, refreshToken }, jwtid) => signToken({ userId, refreshToken }, { expiresIn: ACCESS_TOKEN_EXPIRE, jwtid });
const signRefreshToken = ({ userId }, jwtid) => signToken({ userId }, { expiresIn: REFRESH_TOKEN_EXPIRE, jwtid });
const generateAccessToken = async (userId) => {
    const jwtid = (0, uuid_1.v4)();
    const accessToken = signAccessToken({ userId }, jwtid);
    const refreshToken = signRefreshToken({ userId }, jwtid);
    return { accessToken, refreshToken, jwtid };
};
exports.generateAccessToken = generateAccessToken;
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, JWT_SECRET);
exports.verifyAccessToken = verifyAccessToken;
const authCookieOptions = (secure = false) => ({
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY_MS),
    maxAge: ONE_DAY_MS,
    secure,
    sameSite: "lax",
    path: "/",
    ...(config_1.env.COOKIE_DOMAIN ? { domain: config_1.env.COOKIE_DOMAIN } : {}),
});
const setAuthCookies = (res, secure, accessToken) => {
    res.cookie(config_1.env.AUTH_TOKEN_KEY, accessToken, authCookieOptions(secure));
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: config_1.env.NODE_ENV === "production",
        path: "/",
        ...(config_1.env.COOKIE_DOMAIN ? { domain: config_1.env.COOKIE_DOMAIN } : {}),
    };
    res.clearCookie(config_1.env.AUTH_TOKEN_KEY, cookieOptions);
    res.clearCookie(config_1.env.REFRESH_TOKEN_KEY, cookieOptions);
    res.clearCookie("x-org-id", cookieOptions);
};
exports.clearAuthCookies = clearAuthCookies;
//# sourceMappingURL=index.js.map