"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdate = void 0;
const bcrypt_1 = require("bcrypt");
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
const types_1 = require("../types");
exports.UserUpdate = (0, nexus_1.mutationField)("userUpdate", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
        input: (0, nexus_1.nonNull)(types_1.UserUpdateInput),
    },
    resolve: async (_parent, { id, input }, ctx) => {
        const { email, phone, name, password, isPlatformAdmin, organizationId, role, } = input;
        const user = await ctx.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw errors_1.Errors.User.USER_NOT_FOUND();
        if (email || phone) {
            const existing = await ctx.prisma.user.findFirst({
                where: {
                    id: { not: id },
                    OR: [email ? { email } : {}, phone ? { phone } : {}].filter(Boolean),
                },
            });
            if (existing)
                throw errors_1.Errors.User.DUPLICATE_USER();
        }
        if (organizationId && !role)
            throw errors_1.Errors.User.ROLE_REQUIRED();
        if (role && !organizationId)
            throw errors_1.Errors.User.ROLE_REQUIRED();
        if (organizationId) {
            const organization = await ctx.prisma.organization.findUnique({
                where: { id: organizationId },
            });
            if (!organization)
                throw errors_1.Errors.System.DATA_NOT_FOUND();
        }
        const updateUser = ctx.prisma.user.update({
            where: { id },
            data: {
                email,
                phone,
                name,
                password: password ? (0, bcrypt_1.hashSync)(password, 10) : undefined,
                isPlatformAdmin: isPlatformAdmin ?? undefined,
            },
        });
        const upsertMembership = organizationId && role
            ? ctx.prisma.membership.upsert({
                where: {
                    userId_organizationId: {
                        userId: id,
                        organizationId,
                    },
                },
                create: {
                    userId: id,
                    organizationId,
                    role,
                },
                update: {
                    role,
                },
            })
            : undefined;
        if (upsertMembership) {
            await ctx.prisma.$transaction([updateUser, upsertMembership]);
        }
        else {
            await updateUser;
        }
        return true;
    },
});
//# sourceMappingURL=user-update.js.map