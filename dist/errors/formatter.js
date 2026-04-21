"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const errors_1 = require("@apollo/server/errors");
const ability_1 = require("@casl/ability");
const formatError = (formattedError, error) => {
    const originalError = (0, errors_1.unwrapResolverError)(error);
    console.error("GraphQL Error:", originalError);
    const message = originalError.message ||
        formattedError.message ||
        "Тодорхойгүй алдаа гарлаа. Администраторт хандана уу.";
    let code = formattedError.extensions?.code ||
        originalError.code ||
        "INTERNAL_SERVER_ERROR";
    if (originalError instanceof ability_1.ForbiddenError) {
        code = "FORBIDDEN";
        return {
            message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
            extensions: { code },
        };
    }
    switch (code) {
        case "PERMISSION_DENIED":
        case "UNAUTHORIZED":
        case "FORBIDDEN":
            return {
                message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
                extensions: { code },
            };
        case "UNAUTHENTICATED":
            return {
                message: "Та нэвтрээгүй байна. Нэвтрэх шаардлагатай.",
                extensions: { code },
            };
        case errors_1.ApolloServerErrorCode.BAD_USER_INPUT:
            return {
                message,
                extensions: {
                    code,
                    details: originalError.details,
                },
            };
        default:
            return {
                message,
                extensions: { code },
            };
    }
};
exports.formatError = formatError;
//# sourceMappingURL=formatter.js.map