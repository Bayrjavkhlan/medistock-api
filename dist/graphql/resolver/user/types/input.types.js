"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateInput = exports.UserCreateInput = exports.UsersWhereInput = void 0;
const nexus_1 = require("nexus");
const typedef_1 = require("../../../../graphql/typedef");
exports.UsersWhereInput = (0, nexus_1.inputObjectType)({
    name: "UsersWhereInput",
    definition: (t) => {
        t.nullable.string("search");
        t.nullable.string("organizationId");
    },
});
exports.UserCreateInput = (0, nexus_1.inputObjectType)({
    name: "UserCreateInput",
    definition: (t) => {
        t.nonNull.string("email");
        t.string("phone");
        t.string("name");
        t.nonNull.string("password");
        t.boolean("isPlatformAdmin");
        t.string("organizationId");
        t.field("role", { type: typedef_1.OrganizationRoleEnum });
    },
});
exports.UserUpdateInput = (0, nexus_1.inputObjectType)({
    name: "UserUpdateInput",
    definition: (t) => {
        t.string("email");
        t.string("phone");
        t.string("name");
        t.string("password");
        t.boolean("isPlatformAdmin");
        t.string("organizationId");
        t.field("role", { type: typedef_1.OrganizationRoleEnum });
    },
});
//# sourceMappingURL=input.types.js.map