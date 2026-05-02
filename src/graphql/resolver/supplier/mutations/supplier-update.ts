import { OrganizationRole } from "@prisma/client";
import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

import { SupplierUpdateInput } from "../types";

export const SupplierUpdate = mutationField("supplierUpdate", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    input: nonNull(SupplierUpdateInput),
  },
  resolve: async (_parent, { id, input }, ctx) => {
    const supplier = await ctx.prisma.supplier.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            address: true,
            memberships: true,
          },
        },
      },
    });
    if (!supplier) throw Errors.Supplier.SUPPLIER_NOT_FOUND();

    const canManage =
      ctx.reqUser?.user?.isPlatformAdmin ||
      (ctx.activeOrg?.organization.id === supplier.organizationId &&
        (ctx.activeOrg.role === OrganizationRole.OWNER ||
          ctx.activeOrg.role === OrganizationRole.MANAGER));
    if (!canManage) throw Errors.System.PERMISSION_DENIED();

    await ctx.prisma.organization.update({
      where: { id: supplier.organizationId },
      data: {
        name: input.name,
        address: input.address
          ? supplier.organization.address
            ? {
                update: {
                  address1: input.address.address1,
                  address2: input.address.address2 || null,
                  province: input.address.province,
                },
              }
            : {
                create: {
                  address1: input.address.address1,
                  address2: input.address.address2 || null,
                  province: input.address.province,
                },
              }
          : undefined,
        memberships: input.ownerUserId
          ? {
              upsert: [
                {
                  where: {
                    userId_organizationId: {
                      userId: input.ownerUserId,
                      organizationId: supplier.organizationId,
                    },
                  },
                  update: { role: OrganizationRole.OWNER },
                  create: {
                    userId: input.ownerUserId,
                    role: OrganizationRole.OWNER,
                  },
                },
              ],
            }
          : undefined,
        supplier: {
          update: {
            description: input.description || null,
            logoUrl: input.logoUrl || null,
            email: input.email || null,
            phone: input.phone || null,
            website: input.website || null,
            status: input.status ?? supplier.status,
          },
        },
      },
    });

    return true;
  },
});
