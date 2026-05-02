import { OrganizationRole } from "@prisma/client";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { SupplyItemUpdateInput } from "../types";

export const SupplyItemUpdate = mutationField("supplyItemUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(SupplyItemUpdateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const [existingItem, targetSupplier] = await Promise.all([
      ctx.prisma.supplyItem.findUnique({
        where: { id },
        include: { supplier: true },
      }),
      ctx.prisma.supplier.findUnique({
        where: { id: input.supplierId },
      }),
    ]);

    if (!existingItem) throw Errors.Supply.SUPPLY_ITEM_NOT_FOUND();
    if (!targetSupplier) throw Errors.Supplier.SUPPLIER_NOT_FOUND();

    const relevantOrgId = ctx.reqUser?.user?.isPlatformAdmin
      ? targetSupplier.organizationId
      : existingItem.supplier.organizationId;

    const canManage =
      ctx.reqUser?.user?.isPlatformAdmin ||
      (ctx.activeOrg?.organization.id === relevantOrgId &&
        (ctx.activeOrg.role === OrganizationRole.OWNER ||
          ctx.activeOrg.role === OrganizationRole.MANAGER));
    if (!canManage) throw Errors.System.PERMISSION_DENIED();

    if (
      !ctx.reqUser?.user?.isPlatformAdmin &&
      existingItem.supplier.organizationId !== targetSupplier.organizationId
    ) {
      throw Errors.System.PERMISSION_DENIED();
    }

    await ctx.prisma.supplyItem.update({
      where: { id },
      data: {
        supplierId: input.supplierId,
        name: input.name,
        shortDescription: input.shortDescription || null,
        description: input.description || null,
        category: input.category,
        model: input.model || null,
        brand: input.brand || null,
        manufacturer: input.manufacturer || null,
        price: input.price ?? null,
        currency: input.currency || "USD",
        availability: input.availability ?? existingItem.availability,
        warranty: input.warranty || null,
        contactInfo: input.contactInfo || null,
        imageUrls: input.imageUrls,
        documentUrls: input.documentUrls,
        specifications: input.specifications ?? null,
      },
    });

    return true;
  },
});
