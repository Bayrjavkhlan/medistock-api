import { InventoryStatus } from "@prisma/client";
import { mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import { PharmacyDrugUpsertInput } from "../types";

export const PharmacyDrugUpsert = mutationField("pharmacyDrugUpsert", {
  type: "Boolean",
  args: {
    input: nonNull(PharmacyDrugUpsertInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const organizationId = ctx.activeOrg?.organization.id;
    const organizationType = ctx.activeOrg?.organization.type;

    if (!organizationId || organizationType !== "PHARMACY") {
      throw Errors.System.PERMISSION_DENIED();
    }

    const pharmacy = await ctx.prisma.pharmacy.findUnique({
      where: { organizationId },
    });

    if (!pharmacy) throw Errors.System.PERMISSION_DENIED();

    const drug = await ctx.prisma.drug.findUnique({
      where: { id: input.drugId },
    });

    if (!drug) throw Errors.Drug.DRUG_NOT_FOUND();

    await ctx.prisma.pharmacyDrug.upsert({
      where: {
        pharmacyId_drugId: {
          pharmacyId: pharmacy.id,
          drugId: input.drugId,
        },
      },
      update: {
        quantity: input.quantity,
        price: input.price ?? null,
        status: input.status as InventoryStatus,
      },
      create: {
        pharmacyId: pharmacy.id,
        drugId: input.drugId,
        quantity: input.quantity,
        price: input.price ?? null,
        status: input.status as InventoryStatus,
      },
    });

    return true;
  },
});
