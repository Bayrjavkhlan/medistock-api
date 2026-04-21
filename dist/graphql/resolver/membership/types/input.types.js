"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipUpdateInput = exports.MembershipCreateInput = void 0;
const nexus_1 = require("nexus");
const typedef_1 = require("../../../../graphql/typedef");
exports.MembershipCreateInput = (0, nexus_1.inputObjectType)({
    name: "MembershipCreateInput",
    definition: (t) => {
        t.nonNull.string("userId");
        t.nonNull.field("role", { type: typedef_1.OrganizationRoleEnum });
    },
});
exports.MembershipUpdateInput = (0, nexus_1.inputObjectType)({
    name: "MembershipUpdateInput",
    definition: (t) => {
        t.nonNull.field("role", { type: typedef_1.OrganizationRoleEnum });
    },
});
//# sourceMappingURL=input.types.js.map