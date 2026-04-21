"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyErrors = exports.PharmacyErrorMap = void 0;
const graphql_1 = require("graphql");
exports.PharmacyErrorMap = {
    PHARMACY_NOT_FOUND: {
        code: "PHARMACY_NOT_FOUND",
        message: "Эмийн сан олдсонгүй",
    },
    DUPLICATE_PHARMACY: {
        code: "DUPLICATE_PHARMACY",
        message: "Бүртгэлтэй эмийн сан байна",
    },
};
exports.PharmacyErrors = {
    PHARMACY_NOT_FOUND: () => new graphql_1.GraphQLError(exports.PharmacyErrorMap.PHARMACY_NOT_FOUND.message, {
        extensions: exports.PharmacyErrorMap.PHARMACY_NOT_FOUND,
    }),
    DUPLICATE_PHARMACY: () => new graphql_1.GraphQLError(exports.PharmacyErrorMap.DUPLICATE_PHARMACY.message, {
        extensions: exports.PharmacyErrorMap.DUPLICATE_PHARMACY,
    }),
};
//# sourceMappingURL=pharmacy.js.map