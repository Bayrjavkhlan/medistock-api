import { inputObjectType } from "nexus";

import { SupplierStatusEnum } from "@/graphql/typedef";

export const SupplierAddressInput = inputObjectType({
  name: "SupplierAddressInput",
  definition(t) {
    t.nonNull.string("address1");
    t.string("address2");
    t.nonNull.string("province");
  },
});

export const SuppliersWhereInput = inputObjectType({
  name: "SuppliersWhereInput",
  definition(t) {
    t.string("search");
    t.field("status", { type: SupplierStatusEnum });
  },
});

export const SupplierCreateInput = inputObjectType({
  name: "SupplierCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("description");
    t.string("logoUrl");
    t.string("email");
    t.string("phone");
    t.string("website");
    t.field("status", { type: SupplierStatusEnum });
    t.field("address", { type: SupplierAddressInput });
    t.string("ownerUserId");
  },
});

export const SupplierUpdateInput = inputObjectType({
  name: "SupplierUpdateInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("description");
    t.string("logoUrl");
    t.string("email");
    t.string("phone");
    t.string("website");
    t.field("status", { type: SupplierStatusEnum });
    t.field("address", { type: SupplierAddressInput });
    t.string("ownerUserId");
  },
});
