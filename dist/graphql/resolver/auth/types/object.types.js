"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutPayload = exports.ResendOtpPayload = exports.VerifyOtpPayload = exports.SignUpPayload = exports.LoginPayload = exports.MePayload = exports.AuthUserObject = exports.UserMembershipObject = exports.OrganizationSummary = void 0;
const nexus_1 = require("nexus");
const typedef_1 = require("../../../../graphql/typedef");
exports.OrganizationSummary = (0, nexus_1.objectType)({
    name: "OrganizationSummary",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("name");
        t.nonNull.field("type", { type: typedef_1.OrganizationTypeEnum });
    },
});
exports.UserMembershipObject = (0, nexus_1.objectType)({
    name: "UserMembership",
    definition(t) {
        t.nonNull.field("role", { type: typedef_1.OrganizationRoleEnum });
        t.nonNull.field("organization", { type: exports.OrganizationSummary });
    },
});
exports.AuthUserObject = (0, nexus_1.objectType)({
    name: "AuthUser",
    definition(t) {
        t.nonNull.string("id");
        t.string("email");
        t.string("name");
        t.string("phone");
        t.nonNull.boolean("isPlatformAdmin");
        t.nonNull.list.nonNull.field("memberships", {
            type: exports.UserMembershipObject,
        });
    },
});
exports.MePayload = (0, nexus_1.objectType)({
    name: "MePayload",
    definition(t) {
        t.nonNull.field("user", { type: exports.AuthUserObject });
        t.nullable.field("activeOrganization", { type: exports.UserMembershipObject });
    },
});
exports.LoginPayload = (0, nexus_1.objectType)({
    name: "LoginPayload",
    definition(t) {
        t.nonNull.field("user", { type: exports.AuthUserObject });
        t.nonNull.string("accessToken");
        t.nonNull.string("refreshToken");
        t.nonNull.string("accessTokenExpiresAt");
    },
});
exports.SignUpPayload = (0, nexus_1.objectType)({
    name: "SignUpPayload",
    definition(t) {
        t.nonNull.string("message");
    },
});
exports.VerifyOtpPayload = (0, nexus_1.objectType)({
    name: "VerifyOtpPayload",
    definition(t) {
        t.nonNull.string("message");
    },
});
exports.ResendOtpPayload = (0, nexus_1.objectType)({
    name: "ResendOtpPayload",
    definition(t) {
        t.nonNull.string("message");
    },
});
exports.LogoutPayload = (0, nexus_1.objectType)({
    name: "LogoutPayload",
    definition(t) {
        t.nonNull.string("message");
    },
});
//# sourceMappingURL=object.types.js.map