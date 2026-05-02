import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const SupplierDelete = mutationField("supplierDelete", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, ctx) => {
    if (!ctx.reqUser?.user?.isPlatformAdmin) {
      throw Errors.System.PERMISSION_DENIED();
    }

    const supplier = await ctx.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) throw Errors.Supplier.SUPPLIER_NOT_FOUND();

    await ctx.prisma.$transaction([
      ctx.prisma.supplyItem.deleteMany({
        where: { supplierId: id },
      }),
      ctx.prisma.membership.deleteMany({
        where: { organizationId: supplier.organizationId },
      }),
      ctx.prisma.supplier.delete({ where: { id } }),
      ctx.prisma.address.deleteMany({
        where: { organizationId: supplier.organizationId },
      }),
      ctx.prisma.organization.delete({
        where: { id: supplier.organizationId },
      }),
    ]);

    return true;
  },
});
