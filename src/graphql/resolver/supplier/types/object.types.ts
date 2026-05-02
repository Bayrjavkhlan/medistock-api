import { Prisma } from "@prisma/client";
import { objectType } from "nexus";
import { Supplier } from "nexus-prisma";

import { SupplierStatusEnum } from "@/graphql/typedef";

import { AddressObjectType } from "../../hospital";

type SupplierWithRelations = Prisma.SupplierGetPayload<{
  include: {
    organization: { include: { address: true } };
    supplyItems: true;
  };
}>;

export const SupplierObjectType = objectType({
  name: Supplier.$name,
  definition(t) {
    t.string(Supplier.id.name);
    t.nonNull.string("organizationId", {
      resolve: (supplier: any) =>
        (supplier as SupplierWithRelations).organizationId,
    });
    t.nonNull.string("name", {
      resolve: (supplier: any) =>
        (supplier as SupplierWithRelations).organization.name,
    });
    t.string(Supplier.description.name);
    t.string(Supplier.logoUrl.name);
    t.string(Supplier.email.name);
    t.string(Supplier.phone.name);
    t.string(Supplier.website.name);
    t.nonNull.field(Supplier.status.name, { type: SupplierStatusEnum });
    t.nullable.field("address", {
      type: AddressObjectType,
      resolve: (supplier: any) =>
        (supplier as SupplierWithRelations).organization.address ?? null,
    });
    t.nonNull.int("supplyItemCount", {
      resolve: (supplier: any) =>
        (supplier as SupplierWithRelations).supplyItems?.length ?? 0,
    });
    t.nonNull.list.nonNull.string("categoriesSupplied", {
      resolve: (supplier: any) => {
        const categories =
          (supplier as SupplierWithRelations).supplyItems?.map(
            (item) => item.category
          ) ?? [];
        return [...new Set(categories)];
      },
    });
    t.dateTime(Supplier.createdAt.name);
    t.dateTime(Supplier.updatedAt.name);
  },
});

export const SuppliersObjectType = objectType({
  name: "Suppliers",
  definition(t) {
    t.list.nonNull.field("data", { type: SupplierObjectType });
    t.nonNull.int("count");
  },
});
