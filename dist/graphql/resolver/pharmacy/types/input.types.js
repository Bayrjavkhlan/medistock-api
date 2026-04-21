"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyCreateInput = exports.PharmaciesWhereInput = void 0;
const nexus_1 = require("nexus");
const hospital_1 = require("../../hospital");
exports.PharmaciesWhereInput = (0, nexus_1.inputObjectType)({
    name: "PharmaciesWhereInput",
    definition: (t) => {
        t.nullable.string("search");
    },
});
exports.PharmacyCreateInput = (0, nexus_1.inputObjectType)({
    name: "PharmacyCreateInput",
    definition: (t) => {
        t.nonNull.string("name");
        t.nonNull.string("phone");
        t.nonNull.email("email");
        t.nonNull.field("address", { type: hospital_1.AddressCreateInput });
    },
});
//# sourceMappingURL=input.types.js.map