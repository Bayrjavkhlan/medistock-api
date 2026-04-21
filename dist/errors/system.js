"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemErrors = exports.SystemErrorMap = void 0;
const graphql_1 = require("graphql");
exports.SystemErrorMap = {
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Системийн алдаа гарлаа.",
    },
    DATA_NOT_FOUND: {
        code: "DATA_NOT_FOUND",
        message: "Мэдээлэл олдсонгүй.",
    },
    PERMISSION_DENIED: {
        code: "PERMISSION_DENIED",
        message: "Энэ үйлдлийг хийх эрхгүй байна.",
    },
    ACCESS_DENIED: {
        code: "ACCESS_DENIED",
        message: "Хандах эрхгүй байна.",
    },
    TOO_MANY_REQUESTS: {
        code: "TOO_MANY_REQUESTS",
        message: "Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу.",
        httpStatus: 429,
    },
};
exports.SystemErrors = {
    INTERNAL_SERVER_ERROR: () => new graphql_1.GraphQLError(exports.SystemErrorMap.INTERNAL_SERVER_ERROR.message, {
        extensions: { code: exports.SystemErrorMap.INTERNAL_SERVER_ERROR.code },
    }),
    DATA_NOT_FOUND: () => new graphql_1.GraphQLError(exports.SystemErrorMap.DATA_NOT_FOUND.message, {
        extensions: { code: exports.SystemErrorMap.DATA_NOT_FOUND.code },
    }),
    PERMISSION_DENIED: () => new graphql_1.GraphQLError(exports.SystemErrorMap.PERMISSION_DENIED.message, {
        extensions: { code: exports.SystemErrorMap.PERMISSION_DENIED.code },
    }),
    ACCESS_DENIED: () => new graphql_1.GraphQLError(exports.SystemErrorMap.ACCESS_DENIED.message, {
        extensions: { code: exports.SystemErrorMap.ACCESS_DENIED.code },
    }),
    TOO_MANY_REQUESTS: () => new graphql_1.GraphQLError(exports.SystemErrorMap.TOO_MANY_REQUESTS.message, {
        extensions: {
            code: exports.SystemErrorMap.TOO_MANY_REQUESTS.code,
            http: { status: exports.SystemErrorMap.TOO_MANY_REQUESTS.httpStatus },
        },
    }),
};
//# sourceMappingURL=system.js.map