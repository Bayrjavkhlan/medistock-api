"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpResendRemainingSeconds = exports.buildOtpState = exports.generateOtpCode = exports.assertStrongPassword = exports.assertValidEmail = exports.assertValidName = exports.normalizeEmail = exports.OTP_MAX_VERIFY_ATTEMPTS = exports.OTP_RESEND_COOLDOWN_SECONDS = exports.OTP_EXPIRY_MINUTES = exports.OTP_LENGTH = void 0;
const crypto_1 = require("crypto");
const errors_1 = require("../../errors");
exports.OTP_LENGTH = 6;
exports.OTP_EXPIRY_MINUTES = 10;
exports.OTP_RESEND_COOLDOWN_SECONDS = 60;
exports.OTP_MAX_VERIFY_ATTEMPTS = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
const normalizeEmail = (email) => email.trim().toLowerCase();
exports.normalizeEmail = normalizeEmail;
const assertValidName = (name) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
        throw errors_1.Errors.User.NAME_REQUIRED();
    }
    return normalizedName;
};
exports.assertValidName = assertValidName;
const assertValidEmail = (email) => {
    const normalizedEmail = (0, exports.normalizeEmail)(email);
    if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw errors_1.Errors.User.INVALID_EMAIL();
    }
    return normalizedEmail;
};
exports.assertValidEmail = assertValidEmail;
const assertStrongPassword = (password) => {
    if (!PASSWORD_REGEX.test(password)) {
        throw errors_1.Errors.User.WEAK_PASSWORD();
    }
    return password;
};
exports.assertStrongPassword = assertStrongPassword;
const generateOtpCode = () => (0, crypto_1.randomInt)(10 ** (exports.OTP_LENGTH - 1), 10 ** exports.OTP_LENGTH).toString();
exports.generateOtpCode = generateOtpCode;
const buildOtpState = () => {
    const now = Date.now();
    return {
        otp: (0, exports.generateOtpCode)(),
        otpExpiry: new Date(now + exports.OTP_EXPIRY_MINUTES * 60 * 1000),
        otpAttempts: 0,
        otpLastSentAt: new Date(now),
    };
};
exports.buildOtpState = buildOtpState;
const getOtpResendRemainingSeconds = (otpLastSentAt) => {
    if (!otpLastSentAt)
        return 0;
    const elapsedSeconds = Math.floor((Date.now() - otpLastSentAt.getTime()) / 1000);
    return Math.max(0, exports.OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
};
exports.getOtpResendRemainingSeconds = getOtpResendRemainingSeconds;
//# sourceMappingURL=credentials.js.map