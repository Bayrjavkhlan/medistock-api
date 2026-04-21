"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDrugsObjectType = exports.PharmacyDrugObjectType = exports.DrugsObjectType = exports.DrugObjectType = exports.DrugAvailabilityObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const hospital_1 = require("../../hospital");
exports.DrugAvailabilityObjectType = (0, nexus_1.objectType)({
    name: "DrugAvailability",
    definition(t) {
        t.nonNull.string("id");
        t.nullable.float("price");
        t.nonNull.int("quantity");
        t.nullable.string("status");
        t.nullable.dateTime("updatedAt");
        t.nonNull.string("pharmacyId", {
            resolve: (listing) => listing.pharmacy.id,
        });
        t.nonNull.string("pharmacyName", {
            resolve: (listing) => listing.pharmacy.organization.name,
        });
        t.nonNull.string("organizationId", {
            resolve: (listing) => listing.pharmacy.organizationId,
        });
        t.nullable.string("pharmacyEmail", {
            resolve: (listing) => listing.pharmacy.email ?? null,
        });
        t.nullable.string("pharmacyPhone", {
            resolve: (listing) => listing.pharmacy.phone ?? null,
        });
        t.nullable.field("address", {
            type: hospital_1.AddressObjectType,
            resolve: (listing) => listing.pharmacy.organization.address ?? null,
        });
    },
});
exports.DrugObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Drug.$name,
    definition(t) {
        t.string(nexus_prisma_1.Drug.id.name);
        t.string(nexus_prisma_1.Drug.name.name);
        t.string(nexus_prisma_1.Drug.genericName.name);
        t.string(nexus_prisma_1.Drug.dosageForm.name);
        t.string(nexus_prisma_1.Drug.strength.name);
        t.string(nexus_prisma_1.Drug.manufacturer.name);
        t.string(nexus_prisma_1.Drug.description.name);
        t.nonNull.int("totalStock", {
            resolve: (drug) => drug.listings?.reduce((sum, listing) => sum + listing.quantity, 0) ?? 0,
        });
        t.nullable.float("startingPrice", {
            resolve: (drug) => {
                const prices = drug.listings
                    ?.map((listing) => listing.price)
                    .filter((price) => price != null) ?? [];
                if (prices.length === 0)
                    return null;
                return Math.min(...prices);
            },
        });
        t.nonNull.int("availabilityCount", {
            resolve: (drug) => drug.listings?.length ?? 0,
        });
        t.nonNull.list.nonNull.field("availability", {
            type: exports.DrugAvailabilityObjectType,
            resolve: (drug) => drug.listings ?? [],
        });
        t.dateTime(nexus_prisma_1.Drug.createdAt.name);
        t.dateTime(nexus_prisma_1.Drug.updatedAt.name);
    },
});
exports.DrugsObjectType = (0, nexus_1.objectType)({
    name: exports.DrugObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.DrugObjectType });
        t.nonNull.int("count");
    },
});
exports.PharmacyDrugObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.PharmacyDrug.$name,
    definition(t) {
        t.string(nexus_prisma_1.PharmacyDrug.id.name);
        t.nonNull.field(nexus_prisma_1.PharmacyDrug.drug.name, { type: exports.DrugObjectType });
        t.int(nexus_prisma_1.PharmacyDrug.quantity.name);
        t.float(nexus_prisma_1.PharmacyDrug.price.name);
        t.string(nexus_prisma_1.PharmacyDrug.status.name);
        t.dateTime(nexus_prisma_1.PharmacyDrug.updatedAt.name);
    },
});
exports.PharmacyDrugsObjectType = (0, nexus_1.objectType)({
    name: exports.PharmacyDrugObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.PharmacyDrugObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map