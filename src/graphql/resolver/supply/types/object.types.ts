import { Prisma } from "@prisma/client";
import { objectType } from "nexus";
import { SupplyItem } from "nexus-prisma";

import {
  SupplyAvailabilityStatusEnum,
  SupplyItemCategoryEnum,
} from "@/graphql/typedef";

import { SupplierObjectType } from "../../supplier";

type SupplyItemWithRelations = Prisma.SupplyItemGetPayload<{
  include: {
    supplier: {
      include: {
        organization: { include: { address: true } };
        supplyItems: true;
      };
    };
  };
}>;

export const SupplyItemObjectType = objectType({
  name: "SupplyItem",
  definition(t) {
    t.string(SupplyItem.id.name);
    t.nonNull.string("supplierId", {
      resolve: (item: any) => (item as SupplyItemWithRelations).supplierId,
    });
    t.nonNull.field("supplier", { type: SupplierObjectType });
    t.nonNull.string(SupplyItem.name.name);
    t.string(SupplyItem.shortDescription.name);
    t.string(SupplyItem.description.name);
    t.nonNull.field(SupplyItem.category.name, { type: SupplyItemCategoryEnum });
    t.string(SupplyItem.model.name);
    t.string(SupplyItem.brand.name);
    t.string(SupplyItem.manufacturer.name);
    t.float(SupplyItem.price.name);
    t.string(SupplyItem.currency.name);
    t.nonNull.field(SupplyItem.availability.name, {
      type: SupplyAvailabilityStatusEnum,
    });
    t.string(SupplyItem.warranty.name);
    t.string(SupplyItem.contactInfo.name);
    t.nonNull.list.nonNull.string("imageUrls");
    t.nonNull.list.nonNull.string("documentUrls");
    t.field("specifications", { type: "JSON" });
    t.dateTime(SupplyItem.createdAt.name);
    t.dateTime(SupplyItem.updatedAt.name);
  },
});

export const SupplyItemsObjectType = objectType({
  name: "SupplyItems",
  definition(t) {
    t.list.nonNull.field("data", { type: SupplyItemObjectType });
    t.nonNull.int("count");
  },
});
