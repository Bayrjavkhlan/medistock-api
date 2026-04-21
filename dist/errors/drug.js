"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugErrors = exports.DrugErrorMap = void 0;
const graphql_1 = require("graphql");
exports.DrugErrorMap = {
    DRUG_NOT_FOUND: {
        code: "DRUG_NOT_FOUND",
        message: "Эм олдсонгүй",
    },
    DUPLICATE_DRUG: {
        code: "DUPLICATE_DRUG",
        message: "Бүртгэлтэй эм байна",
    },
};
exports.DrugErrors = {
    DRUG_NOT_FOUND: () => new graphql_1.GraphQLError(exports.DrugErrorMap.DRUG_NOT_FOUND.message, {
        extensions: exports.DrugErrorMap.DRUG_NOT_FOUND,
    }),
    DUPLICATE_DRUG: () => new graphql_1.GraphQLError(exports.DrugErrorMap.DUPLICATE_DRUG.message, {
        extensions: exports.DrugErrorMap.DUPLICATE_DRUG,
    }),
};
//# sourceMappingURL=drug.js.map