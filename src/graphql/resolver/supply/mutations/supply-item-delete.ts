import { OrganizationRole } from "@prisma/client";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const SupplyItemDelete = mutationField("supplyItemDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    const supplyItem = await ctx.prisma.supplyItem.findUnique({
      where: { id },
      include: { supplier: true },
    });
    if (!supplyItem) throw Errors.Supply.SUPPLY_ITEM_NOT_FOUND();

    const canManage =
      ctx.reqUser?.user?.isPlatformAdmin ||
      (ctx.activeOrg?.organization.id === supplyItem.supplier.organizationId &&
        (ctx.activeOrg.role === OrganizationRole.OWNER ||
          ctx.activeOrg.role === OrganizationRole.MANAGER));
    if (!canManage) throw Errors.System.PERMISSION_DENIED();

    await ctx.prisma.supplyItem.delete({ where: { id } });
    return true;
  },
});
