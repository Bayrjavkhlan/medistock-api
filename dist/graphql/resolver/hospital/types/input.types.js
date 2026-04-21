"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressCreateInput = exports.HospitalCreateInput = exports.HospitalsWhereInput = void 0;
const nexus_1 = require("nexus");
exports.HospitalsWhereInput = (0, nexus_1.inputObjectType)({
    name: "HospitalsWhereInput",
    definition: (t) => {
        t.nullable.string("search");
        t.nullable.string("address");
    },
});
// export const HospitalWhereInput = inputObjectType({
//   name: "HospitalWhereInput",
//   definition: (t) => {
//     t.nonNull.string("name");
//     t.nonNull.string("email");
//     t.nonNull.string("phone");
//   },
// });
exports.HospitalCreateInput = (0, nexus_1.inputObjectType)({
    name: "HospitalCreateInput",
    definition: (t) => {
        t.nonNull.string("name");
        t.nonNull.string("phone");
        t.nonNull.email("email");
        t.nonNull.field("address", {
            type: exports.AddressCreateInput,
        });
    },
});
exports.AddressCreateInput = (0, nexus_1.inputObjectType)({
    name: "AddressCreateInput",
    definition(t) {
        t.nonNull.string("address1");
        t.string("address2");
        t.nonNull.string("province");
    },
});
//# sourceMappingURL=input.types.js.map