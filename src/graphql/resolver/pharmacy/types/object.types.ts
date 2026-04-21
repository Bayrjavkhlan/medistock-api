import { Prisma } from "@prisma/client";
import { objectType } from "nexus";
import { Pharmacy } from "nexus-prisma";

import { PharmacyDrugObjectType } from "../../drug";
import { AddressObjectType } from "../../hospital";

type PharmacyWithOrganization = Prisma.PharmacyGetPayload<{
  include: { organization: { include: { address: true } } };
}>;

export const PharmacyObjectType = objectType({
  name: Pharmacy.$name,
  definition(t) {
    t.string(Pharmacy.id.name);
    t.string("name", {
      resolve: (pharmacy: any) =>
        (pharmacy as PharmacyWithOrganization).organization.name,
    });
    t.string(Pharmacy.email.name);
    t.string(Pharmacy.phone.name);
    t.nullable.field("address", {
      type: AddressObjectType,
      resolve: (pharmacy: any) =>
        (pharmacy as PharmacyWithOrganization).organization.address,
    });
    t.nonNull.int("inventoryCount", {
      resolve: (pharmacy: any) => pharmacy.inventory?.length ?? 0,
    });
    t.nonNull.list.nonNull.field("inventory", {
      type: PharmacyDrugObjectType,
      resolve: (pharmacy: any) => pharmacy.inventory ?? [],
    });
    t.dateTime(Pharmacy.createdAt.name);
    t.dateTime(Pharmacy.updatedAt.name);
  },
});

export const PharmaciesObjectType = objectType({
  name: PharmacyObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: PharmacyObjectType });
    t.nonNull.int("count");
  },
});

export const PharmacyOptionObjectType = objectType({
  name: "PharmacyOption",
  definition(t) {
    t.string("name");
    t.string("id");
  },
});
