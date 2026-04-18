import { objectType } from "nexus";
import { Drug, PharmacyDrug } from "nexus-prisma";

import { AddressObjectType } from "../../hospital";

export const DrugAvailabilityObjectType = objectType({
  name: "DrugAvailability",
  definition(t) {
    t.nonNull.string("id");
    t.nullable.float("price");
    t.nonNull.int("quantity");
    t.nullable.string("status");
    t.nullable.dateTime("updatedAt");
    t.nonNull.string("pharmacyId", {
      resolve: (listing: any) => listing.pharmacy.id,
    });
    t.nonNull.string("pharmacyName", {
      resolve: (listing: any) => listing.pharmacy.organization.name,
    });
    t.nullable.field("address", {
      type: AddressObjectType,
      resolve: (listing: any) => listing.pharmacy.organization.address ?? null,
    });
  },
});

export const DrugObjectType = objectType({
  name: Drug.$name,
  definition(t) {
    t.string(Drug.id.name);
    t.string(Drug.name.name);
    t.string(Drug.genericName.name);
    t.string(Drug.dosageForm.name);
    t.string(Drug.strength.name);
    t.string(Drug.manufacturer.name);
    t.string(Drug.description.name);
    t.nonNull.int("totalStock", {
      resolve: (drug: any) =>
        drug.listings?.reduce(
          (sum: number, listing: any) => sum + listing.quantity,
          0
        ) ?? 0,
    });
    t.nullable.float("startingPrice", {
      resolve: (drug: any) => {
        const prices =
          drug.listings
            ?.map((listing: any) => listing.price)
            .filter(
              (price: number | null | undefined): price is number =>
                price != null
            ) ?? [];

        if (prices.length === 0) return null;

        return Math.min(...prices);
      },
    });
    t.nonNull.int("availabilityCount", {
      resolve: (drug: any) => drug.listings?.length ?? 0,
    });
    t.nonNull.list.nonNull.field("availability", {
      type: DrugAvailabilityObjectType,
      resolve: (drug: any) => drug.listings ?? [],
    });
    t.dateTime(Drug.createdAt.name);
    t.dateTime(Drug.updatedAt.name);
  },
});

export const DrugsObjectType = objectType({
  name: DrugObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: DrugObjectType });
    t.nonNull.int("count");
  },
});

export const PharmacyDrugObjectType = objectType({
  name: PharmacyDrug.$name,
  definition(t) {
    t.string(PharmacyDrug.id.name);
    t.nonNull.field(PharmacyDrug.drug.name, { type: DrugObjectType });
    t.int(PharmacyDrug.quantity.name);
    t.float(PharmacyDrug.price.name);
    t.string(PharmacyDrug.status.name);
    t.dateTime(PharmacyDrug.updatedAt.name);
  },
});

export const PharmacyDrugsObjectType = objectType({
  name: PharmacyDrugObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: PharmacyDrugObjectType });
    t.nonNull.int("count");
  },
});
