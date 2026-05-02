import { enumType, inputObjectType } from "nexus";

import {
  EnumSortOrderType,
  SupplyAvailabilityStatusEnum,
  SupplyItemCategoryEnum,
} from "@/graphql/typedef";

export const SupplyItemSortFieldEnum = enumType({
  name: "SupplyItemSortField",
  members: ["NAME", "PRICE", "UPDATED_AT", "CREATED_AT"],
});

export const SupplyItemsWhereInput = inputObjectType({
  name: "SupplyItemsWhereInput",
  definition(t) {
    t.string("search");
    t.string("supplierId");
    t.field("category", { type: SupplyItemCategoryEnum });
    t.field("availability", { type: SupplyAvailabilityStatusEnum });
    t.float("minPrice");
    t.float("maxPrice");
    t.field("sortBy", { type: SupplyItemSortFieldEnum });
    t.field("sortOrder", { type: EnumSortOrderType });
  },
});

export const SupplyItemCreateInput = inputObjectType({
  name: "SupplyItemCreateInput",
  definition(t) {
    t.nonNull.string("supplierId");
    t.nonNull.string("name");
    t.string("shortDescription");
    t.string("description");
    t.nonNull.field("category", { type: SupplyItemCategoryEnum });
    t.string("model");
    t.string("brand");
    t.string("manufacturer");
    t.float("price");
    t.string("currency");
    t.field("availability", { type: SupplyAvailabilityStatusEnum });
    t.string("warranty");
    t.string("contactInfo");
    t.nonNull.list.nonNull.string("imageUrls");
    t.nonNull.list.nonNull.string("documentUrls");
    t.field("specifications", { type: "JSON" });
  },
});

export const SupplyItemUpdateInput = inputObjectType({
  name: "SupplyItemUpdateInput",
  definition(t) {
    t.nonNull.string("supplierId");
    t.nonNull.string("name");
    t.string("shortDescription");
    t.string("description");
    t.nonNull.field("category", { type: SupplyItemCategoryEnum });
    t.string("model");
    t.string("brand");
    t.string("manufacturer");
    t.float("price");
    t.string("currency");
    t.field("availability", { type: SupplyAvailabilityStatusEnum });
    t.string("warranty");
    t.string("contactInfo");
    t.nonNull.list.nonNull.string("imageUrls");
    t.nonNull.list.nonNull.string("documentUrls");
    t.field("specifications", { type: "JSON" });
  },
});
