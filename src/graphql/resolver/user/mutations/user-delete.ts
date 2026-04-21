import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const UserDelete = mutationField("userDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const user = await ctx.prisma.user.findUnique({ where: { id } });
    if (!user) throw Errors.User.USER_NOT_FOUND();

    const [equipmentAssigned, logsPerformed] = await Promise.all([
      ctx.prisma.equipment.count({ where: { assignedToId: id } }),
      ctx.prisma.equipmentLog.count({ where: { performedById: id } }),
    ]);

    if (equipmentAssigned > 0 || logsPerformed > 0) {
      throw Errors.User.USER_IN_USE();
    }

    await ctx.prisma.$transaction([
      ctx.prisma.membership.deleteMany({ where: { userId: id } }),
      ctx.prisma.user.delete({ where: { id } }),
    ]);

    return true;
  },
});
