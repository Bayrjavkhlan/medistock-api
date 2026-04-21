"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrors = exports.UserErrorMap = void 0;
const graphql_1 = require("graphql");
exports.UserErrorMap = {
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
        message: "Хэрэглэгч олдсонгүй.",
    },
    DUPLICATE_USER: {
        code: "DUPLICATE_USER",
        message: "Ижил мэдээлэлтэй хэрэглэгч аль хэдийн байна.",
    },
    USER_IN_USE: {
        code: "USER_IN_USE",
        message: "Энэ хэрэглэгчийг устгах боломжгүй байна.",
    },
    ROLE_REQUIRED: {
        code: "ROLE_REQUIRED",
        message: "Байгууллагын үүрэг заавал шаардлагатай.",
    },
    NAME_REQUIRED: {
        code: "NAME_REQUIRED",
        message: "Нэрээ оруулна уу.",
    },
    INVALID_EMAIL: {
        code: "INVALID_EMAIL",
        message: "И-мэйл хаягийн формат буруу байна.",
    },
    WEAK_PASSWORD: {
        code: "WEAK_PASSWORD",
        message: "Нууц үг дор хаяж 8 тэмдэгттэй, 1 том үсэг, 1 жижиг үсэг, 1 тоо агуулсан байх ёстой.",
    },
    EMAIL_ALREADY_EXISTS: {
        code: "EMAIL_ALREADY_EXISTS",
        message: "Энэ и-мэйл хаяг аль хэдийн бүртгэлтэй байна.",
    },
    EMAIL_ALREADY_VERIFIED: {
        code: "EMAIL_ALREADY_VERIFIED",
        message: "И-мэйл хаяг аль хэдийн баталгаажсан байна.",
    },
};
exports.UserErrors = {
    USER_NOT_FOUND: () => new graphql_1.GraphQLError(exports.UserErrorMap.USER_NOT_FOUND.message, {
        extensions: exports.UserErrorMap.USER_NOT_FOUND,
    }),
    DUPLICATE_USER: () => new graphql_1.GraphQLError(exports.UserErrorMap.DUPLICATE_USER.message, {
        extensions: exports.UserErrorMap.DUPLICATE_USER,
    }),
    USER_IN_USE: () => new graphql_1.GraphQLError(exports.UserErrorMap.USER_IN_USE.message, {
        extensions: exports.UserErrorMap.USER_IN_USE,
    }),
    ROLE_REQUIRED: () => new graphql_1.GraphQLError(exports.UserErrorMap.ROLE_REQUIRED.message, {
        extensions: exports.UserErrorMap.ROLE_REQUIRED,
    }),
    NAME_REQUIRED: () => new graphql_1.GraphQLError(exports.UserErrorMap.NAME_REQUIRED.message, {
        extensions: exports.UserErrorMap.NAME_REQUIRED,
    }),
    INVALID_EMAIL: () => new graphql_1.GraphQLError(exports.UserErrorMap.INVALID_EMAIL.message, {
        extensions: exports.UserErrorMap.INVALID_EMAIL,
    }),
    WEAK_PASSWORD: () => new graphql_1.GraphQLError(exports.UserErrorMap.WEAK_PASSWORD.message, {
        extensions: exports.UserErrorMap.WEAK_PASSWORD,
    }),
    EMAIL_ALREADY_EXISTS: () => new graphql_1.GraphQLError(exports.UserErrorMap.EMAIL_ALREADY_EXISTS.message, {
        extensions: exports.UserErrorMap.EMAIL_ALREADY_EXISTS,
    }),
    EMAIL_ALREADY_VERIFIED: () => new graphql_1.GraphQLError(exports.UserErrorMap.EMAIL_ALREADY_VERIFIED.message, {
        extensions: exports.UserErrorMap.EMAIL_ALREADY_VERIFIED,
    }),
};
//# sourceMappingURL=user.js.map