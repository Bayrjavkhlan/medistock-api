"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDelete = void 0;
const nexus_1 = require("nexus");
const errors_1 = require("../../../../errors");
exports.UserDelete = (0, nexus_1.mutationField)("userDelete", {
    type: "Boolean",
    args: {
        id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
    },
    resolve: async (_parent, { id }, ctx) => {
        const user = await ctx.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw errors_1.Errors.User.USER_NOT_FOUND();
        const [equipmentAssigned, logsPerformed] = await Promise.all([
            ctx.prisma.equipment.count({ where: { assignedToId: id } }),
            ctx.prisma.equipmentLog.count({ where: { performedById: id } }),
        ]);
        if (equipmentAssigned > 0 || logsPerformed > 0) {
            throw errors_1.Errors.User.USER_IN_USE();
        }
        await ctx.prisma.$transaction([
            ctx.prisma.membership.deleteMany({ where: { userId: id } }),
            ctx.prisma.user.delete({ where: { id } }),
        ]);
        return true;
    },
});
//# sourceMappingURL=user-delete.js.map