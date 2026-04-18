import { mutationField, nonNull, stringArg } from "nexus";

import { Errors } from "@/errors";

export const PharmacyDrugDelete = mutationField("pharmacyDrugDelete", {
  type: "Boolean",
  args: {
    drugId: nonNull(stringArg()),
  },
  resolve: async (_parent, { drugId }, ctx) => {
    const organizationId = ctx.activeOrg?.organization.id;
    const organizationType = ctx.activeOrg?.organization.type;

    if (!organizationId || organizationType !== "PHARMACY") {
      throw Errors.System.PERMISSION_DENIED();
    }

    const pharmacy = await ctx.prisma.pharmacy.findUnique({
      where: { organizationId },
    });

    if (!pharmacy) throw Errors.System.PERMISSION_DENIED();

    const listing = await ctx.prisma.pharmacyDrug.findUnique({
      where: {
        pharmacyId_drugId: {
          pharmacyId: pharmacy.id,
          drugId,
        },
      },
    });

    if (!listing) return true;

    await ctx.prisma.pharmacyDrug.delete({
      where: {
        pharmacyId_drugId: {
          pharmacyId: pharmacy.id,
          drugId,
        },
      },
    });

    return true;
  },
});
