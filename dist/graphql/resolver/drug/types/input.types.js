"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyDrugUpsertInput = exports.DrugCreateInput = exports.PharmacyDrugsWhereInput = exports.DrugsWhereInput = void 0;
const nexus_1 = require("nexus");
exports.DrugsWhereInput = (0, nexus_1.inputObjectType)({
    name: "DrugsWhereInput",
    definition: (t) => {
        t.nullable.string("search");
    },
});
exports.PharmacyDrugsWhereInput = (0, nexus_1.inputObjectType)({
    name: "PharmacyDrugsWhereInput",
    definition: (t) => {
        t.nullable.string("search");
    },
});
exports.DrugCreateInput = (0, nexus_1.inputObjectType)({
    name: "DrugCreateInput",
    definition: (t) => {
        t.nonNull.string("name");
        t.string("genericName");
        t.string("dosageForm");
        t.string("strength");
        t.string("manufacturer");
        t.string("description");
    },
});
exports.PharmacyDrugUpsertInput = (0, nexus_1.inputObjectType)({
    name: "PharmacyDrugUpsertInput",
    definition: (t) => {
        t.nonNull.string("drugId");
        t.nonNull.int("quantity");
        t.float("price");
        t.nonNull.string("status");
    },
});
//# sourceMappingURL=input.types.js.map