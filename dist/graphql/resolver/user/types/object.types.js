"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersObjectType = exports.UserObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
exports.UserObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.User.$name,
    definition(t) {
        t.string(nexus_prisma_1.User.id.name);
        t.string(nexus_prisma_1.User.name.name);
        t.string(nexus_prisma_1.User.email.name);
        t.string(nexus_prisma_1.User.phone.name);
        t.boolean(nexus_prisma_1.User.isPlatformAdmin.name);
        t.dateTime(nexus_prisma_1.User.createdAt.name);
        t.dateTime(nexus_prisma_1.User.updatedAt.name);
    },
});
exports.UsersObjectType = (0, nexus_1.objectType)({
    name: exports.UserObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.UserObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map