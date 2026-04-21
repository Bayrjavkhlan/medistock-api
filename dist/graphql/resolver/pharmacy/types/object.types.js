"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyOptionObjectType = exports.PharmaciesObjectType = exports.PharmacyObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const drug_1 = require("../../drug");
const hospital_1 = require("../../hospital");
exports.PharmacyObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Pharmacy.$name,
    definition(t) {
        t.string(nexus_prisma_1.Pharmacy.id.name);
        t.string("name", {
            resolve: (pharmacy) => pharmacy.organization.name,
        });
        t.string(nexus_prisma_1.Pharmacy.email.name);
        t.string(nexus_prisma_1.Pharmacy.phone.name);
        t.nullable.field("address", {
            type: hospital_1.AddressObjectType,
            resolve: (pharmacy) => pharmacy.organization.address,
        });
        t.nonNull.int("inventoryCount", {
            resolve: (pharmacy) => pharmacy.inventory?.length ?? 0,
        });
        t.nonNull.list.nonNull.field("inventory", {
            type: drug_1.PharmacyDrugObjectType,
            resolve: (pharmacy) => pharmacy.inventory ?? [],
        });
        t.dateTime(nexus_prisma_1.Pharmacy.createdAt.name);
        t.dateTime(nexus_prisma_1.Pharmacy.updatedAt.name);
    },
});
exports.PharmaciesObjectType = (0, nexus_1.objectType)({
    name: exports.PharmacyObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.PharmacyObjectType });
        t.nonNull.int("count");
    },
});
exports.PharmacyOptionObjectType = (0, nexus_1.objectType)({
    name: "PharmacyOption",
    definition(t) {
        t.string("name");
        t.string("id");
    },
});
//# sourceMappingURL=object.types.js.map