"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalErrors = exports.HospitalErrorMap = void 0;
const graphql_1 = require("graphql");
exports.HospitalErrorMap = {
    HOSPITAL_NOT_FOUND: {
        code: "HOSPITAL_NOT_FOUND",
        message: "Эмнэлэг олдсонгүй",
    },
    HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: {
        code: "HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL",
        message: "Эмнэлгийн админд хамааралтай эмнэлэг олдсонгүй",
    },
    DUPLICATE_HOSPITAL: {
        code: "DUPLICATE_HOSPITAL",
        message: "Бүртгэлтэй эмнэлэг байна",
    },
    MEMBER_NOT_IN_ORGANIZATION: {
        code: "MEMBER_NOT_IN_ORGANIZATION",
        message: "Хэрэглэгч тухайн байгууллагад харьяалагдаагүй байна",
    },
};
exports.HospitalErrors = {
    HOSPITAL_NOT_FOUND: () => new graphql_1.GraphQLError(exports.HospitalErrorMap.HOSPITAL_NOT_FOUND.message, {
        extensions: exports.HospitalErrorMap.HOSPITAL_NOT_FOUND,
    }),
    HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: () => new graphql_1.GraphQLError(exports.HospitalErrorMap.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL.message, {
        extensions: exports.HospitalErrorMap.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL,
    }),
    DUPLICATE_HOSPITAL: () => new graphql_1.GraphQLError(exports.HospitalErrorMap.DUPLICATE_HOSPITAL.message, {
        extensions: exports.HospitalErrorMap.DUPLICATE_HOSPITAL,
    }),
    MEMBER_NOT_IN_ORGANIZATION: () => new graphql_1.GraphQLError(exports.HospitalErrorMap.MEMBER_NOT_IN_ORGANIZATION.message, {
        extensions: exports.HospitalErrorMap.MEMBER_NOT_IN_ORGANIZATION,
    }),
};
//# sourceMappingURL=hospital.js.map