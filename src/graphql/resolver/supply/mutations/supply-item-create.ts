import { OrganizationRole } from "@prisma/client";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { SupplyItemCreateInput } from "../types";

export const SupplyItemCreate = mutationField("supplyItemCreate", {
  type: "Boolean",
  args: {
    input: nonNull(SupplyItemCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const supplier = await ctx.prisma.supplier.findUnique({
      where: { id: input.supplierId },
    });
    if (!supplier) throw Errors.Supplier.SUPPLIER_NOT_FOUND();

    const canManage =
      ctx.reqUser?.user?.isPlatformAdmin ||
      (ctx.activeOrg?.organization.id === supplier.organizationId &&
        (ctx.activeOrg.role === OrganizationRole.OWNER ||
          ctx.activeOrg.role === OrganizationRole.MANAGER));
    if (!canManage) throw Errors.System.PERMISSION_DENIED();

    await ctx.prisma.supplyItem.create({
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
        availability: input.availability ?? "AVAILABLE",
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
