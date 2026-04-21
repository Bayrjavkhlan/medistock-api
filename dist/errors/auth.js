"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrors = exports.AuthErrorMap = void 0;
const graphql_1 = require("graphql");
exports.AuthErrorMap = {
    NOT_AUTHORIZED: {
        code: "NOT_AUTHORIZED",
        message: "Хандах эрхгүй байна.",
    },
    INVALID_ACCESS_TOKEN: {
        code: "INVALID_ACCESS_TOKEN",
        message: "Нэвтрэх эрхийн токен буруу байна. Дахин оролдоно уу.",
    },
    ACCESS_TOKEN_EXPIRED: {
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Нэвтрэх эрхийн токены хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
    },
    REFRESH_TOKEN_EXPIRED: {
        code: "REFRESH_TOKEN_EXPIRED",
        message: "Сэргээх токены хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
    },
    INVALID_REFRESH_TOKEN: {
        code: "INVALID_REFRESH_TOKEN",
        message: "Сэргээх токен буруу байна. Дахин нэвтэрнэ үү.",
    },
    WRONG_USERNAME_PASSWORD: {
        code: "WRONG_USERNAME_PASSWORD",
        message: "И-мэйл эсвэл нууц үг буруу байна. Дахин оролдоно уу.",
    },
    EMAIL_NOT_VERIFIED: {
        code: "EMAIL_NOT_VERIFIED",
        message: "И-мэйл хаягаа баталгаажуулсны дараа нэвтэрнэ үү.",
    },
    INVALID_OTP: {
        code: "INVALID_OTP",
        message: "Баталгаажуулах код буруу байна.",
    },
    OTP_EXPIRED: {
        code: "OTP_EXPIRED",
        message: "Баталгаажуулах кодын хугацаа дууссан байна. Дахин код авна уу.",
    },
    OTP_RESEND_TOO_SOON: {
        code: "OTP_RESEND_TOO_SOON",
        message: "Шинэ код хүсэхээсээ өмнө түр хүлээнэ үү.",
    },
    TOO_MANY_OTP_ATTEMPTS: {
        code: "TOO_MANY_OTP_ATTEMPTS",
        message: "Кодыг олон удаа буруу оруулсан байна. Шинэ баталгаажуулах код авна уу.",
    },
};
exports.AuthErrors = {
    NOT_AUTHORIZED: () => new graphql_1.GraphQLError(exports.AuthErrorMap.NOT_AUTHORIZED.message, {
        extensions: exports.AuthErrorMap.NOT_AUTHORIZED,
    }),
    INVALID_ACCESS_TOKEN: () => new graphql_1.GraphQLError(exports.AuthErrorMap.INVALID_ACCESS_TOKEN.message, {
        extensions: exports.AuthErrorMap.INVALID_ACCESS_TOKEN,
    }),
    ACCESS_TOKEN_EXPIRED: () => new graphql_1.GraphQLError(exports.AuthErrorMap.ACCESS_TOKEN_EXPIRED.message, {
        extensions: exports.AuthErrorMap.ACCESS_TOKEN_EXPIRED,
    }),
    REFRESH_TOKEN_EXPIRED: () => new graphql_1.GraphQLError(exports.AuthErrorMap.REFRESH_TOKEN_EXPIRED.message, {
        extensions: exports.AuthErrorMap.REFRESH_TOKEN_EXPIRED,
    }),
    INVALID_REFRESH_TOKEN: () => new graphql_1.GraphQLError(exports.AuthErrorMap.INVALID_REFRESH_TOKEN.message, {
        extensions: exports.AuthErrorMap.INVALID_REFRESH_TOKEN,
    }),
    WRONG_USERNAME_PASSWORD: () => new graphql_1.GraphQLError(exports.AuthErrorMap.WRONG_USERNAME_PASSWORD.message, {
        extensions: exports.AuthErrorMap.WRONG_USERNAME_PASSWORD,
    }),
    EMAIL_NOT_VERIFIED: () => new graphql_1.GraphQLError(exports.AuthErrorMap.EMAIL_NOT_VERIFIED.message, {
        extensions: exports.AuthErrorMap.EMAIL_NOT_VERIFIED,
    }),
    INVALID_OTP: () => new graphql_1.GraphQLError(exports.AuthErrorMap.INVALID_OTP.message, {
        extensions: exports.AuthErrorMap.INVALID_OTP,
    }),
    OTP_EXPIRED: () => new graphql_1.GraphQLError(exports.AuthErrorMap.OTP_EXPIRED.message, {
        extensions: exports.AuthErrorMap.OTP_EXPIRED,
    }),
    OTP_RESEND_TOO_SOON: () => new graphql_1.GraphQLError(exports.AuthErrorMap.OTP_RESEND_TOO_SOON.message, {
        extensions: exports.AuthErrorMap.OTP_RESEND_TOO_SOON,
    }),
    TOO_MANY_OTP_ATTEMPTS: () => new graphql_1.GraphQLError(exports.AuthErrorMap.TOO_MANY_OTP_ATTEMPTS.message, {
        extensions: exports.AuthErrorMap.TOO_MANY_OTP_ATTEMPTS,
    }),
};
//# sourceMappingURL=auth.js.map