"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreate = void 0;
const bcrypt_1 = require("bcrypt");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.UserCreate = (0, nexus_1.mutationField)("userCreate", {
    type: "Boolean",
    args: {
        input: (0, nexus_1.nonNull)(types_1.UserCreateInput),
    },
    resolve: async (_parent, { input }, ctx) => {
        const { email, phone, name, password, isPlatformAdmin, organizationId, role, } = input;
        const existing = await ctx.prisma.user.findFirst({
            where: {
                OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
            },
        });
        if (existing)
            throw errors_1.Errors.User.DUPLICATE_USER();
        if (organizationId && !role)
            throw errors_1.Errors.User.ROLE_REQUIRED();
        if (organizationId) {
            const organization = await ctx.prisma.organization.findUnique({
                where: { id: organizationId },
            });
            if (!organization)
                throw errors_1.Errors.System.DATA_NOT_FOUND();
        }
        const membershipData = organizationId && role ? { organizationId, role } : undefined;
        await ctx.prisma.user.create({
            data: {
                email,
                phone,
                name,
                password: (0, bcrypt_1.hashSync)(password, 10),
                isPlatformAdmin: Boolean(isPlatformAdmin),
                memberships: membershipData
                    ? {
                        create: membershipData,
                    }
                    : undefined,
            },
        });
        return true;
    },
});
//# sourceMappingURL=user-create.js.map