import { OrganizationRole, OrganizationType } from "@prisma/client";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { SupplierCreateInput } from "../types";

export const SupplierCreate = mutationField("supplierCreate", {
  type: "Boolean",
  args: {
    input: nonNull(SupplierCreateInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    if (!ctx.reqUser?.user?.isPlatformAdmin) {
      throw Errors.System.PERMISSION_DENIED();
    }

    const existingOrg = await ctx.prisma.organization.findFirst({
      where: {
        name: input.name,
        type: OrganizationType.SUPPLIER,
      },
    });
    if (existingOrg) throw Errors.Supplier.DUPLICATE_SUPPLIER();

    const existingContact = await ctx.prisma.supplier.findFirst({
      where: {
        OR: [
          input.email ? { email: input.email } : {},
          input.phone ? { phone: input.phone } : {},
        ].filter(Boolean),
      },
    });
    if (existingContact) throw Errors.Supplier.DUPLICATE_SUPPLIER();

    await ctx.prisma.organization.create({
      data: {
        name: input.name,
        type: OrganizationType.SUPPLIER,
        address: input.address
          ? {
              create: {
                address1: input.address.address1,
                address2: input.address.address2 || null,
                province: input.address.province,
              },
            }
          : undefined,
        memberships: input.ownerUserId
          ? {
              create: {
                userId: input.ownerUserId,
                role: OrganizationRole.OWNER,
              },
            }
          : undefined,
        supplier: {
          create: {
            description: input.description || null,
            logoUrl: input.logoUrl || null,
            email: input.email || null,
            phone: input.phone || null,
            website: input.website || null,
            status: input.status ?? "ACTIVE",
          },
        },
      },
    });

    return true;
  },
});
