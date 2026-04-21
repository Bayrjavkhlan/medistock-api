"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipErrors = exports.MembershipErrorMap = void 0;
const graphql_1 = require("graphql");
exports.MembershipErrorMap = {
    MEMBERSHIP_NOT_FOUND: {
        code: "MEMBERSHIP_NOT_FOUND",
        message: "Гишүүнчлэл олдсонгүй",
    },
    DUPLICATE_MEMBERSHIP: {
        code: "DUPLICATE_MEMBERSHIP",
        message: "Гишүүнчлэл бүртгэгдсэн байна",
    },
    LAST_OWNER: {
        code: "LAST_OWNER",
        message: "Сүүлчийн OWNER-г өөрчлөх/устгах боломжгүй",
    },
};
exports.MembershipErrors = {
    MEMBERSHIP_NOT_FOUND: () => new graphql_1.GraphQLError(exports.MembershipErrorMap.MEMBERSHIP_NOT_FOUND.message, {
        extensions: exports.MembershipErrorMap.MEMBERSHIP_NOT_FOUND,
    }),
    DUPLICATE_MEMBERSHIP: () => new graphql_1.GraphQLError(exports.MembershipErrorMap.DUPLICATE_MEMBERSHIP.message, {
        extensions: exports.MembershipErrorMap.DUPLICATE_MEMBERSHIP,
    }),
    LAST_OWNER: () => new graphql_1.GraphQLError(exports.MembershipErrorMap.LAST_OWNER.message, {
        extensions: exports.MembershipErrorMap.LAST_OWNER,
    }),
};
//# sourceMappingURL=membership.js.map