"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const nexus_1 = require("nexus");
const casl_1 = require("../../../../lib/casl");
const prisma_1 = require("../../../../lib/prisma");
const types_1 = require("../types");
exports.Users = (0, nexus_1.queryField)("users", {
    type: types_1.UsersObjectType,
    args: {
        where: (0, nexus_1.arg)({ type: types_1.UsersWhereInput }),
        take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
        skip: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
    },
    resolve: async (_parents, _args, ctx) => {
        const { where, take, skip } = _args;
        const criteria = (0, casl_1.accessibleBy)(ctx.caslAbility, "read", "User");
        if (where?.search) {
            const search = where.search;
            criteria.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }
        if (where?.organizationId) {
            criteria.memberships = {
                some: { organizationId: where.organizationId },
            };
        }
        const users = await ctx.prisma.user.findMany({
            where: criteria,
            ...(0, prisma_1.pagination)(take, skip),
        });
        return {
            data: users,
            count: users.length,
        };
    },
});
//# sourceMappingURL=users.js.map