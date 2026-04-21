"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsObjectType = exports.MembershipObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const typedef_1 = require("../../../../graphql/typedef");
const auth_1 = require("../../auth");
const user_1 = require("../../user");
exports.MembershipObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Membership.$name,
    definition(t) {
        t.string(nexus_prisma_1.Membership.id.name);
        t.nonNull.field("role", { type: typedef_1.OrganizationRoleEnum });
        t.nonNull.field(nexus_prisma_1.Membership.user.name, { type: user_1.UserObjectType });
        t.nonNull.field(nexus_prisma_1.Membership.organization.name, {
            type: auth_1.OrganizationSummary,
        });
        t.dateTime(nexus_prisma_1.Membership.createdAt.name);
    },
});
exports.MembershipsObjectType = (0, nexus_1.objectType)({
    name: exports.MembershipObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.MembershipObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map