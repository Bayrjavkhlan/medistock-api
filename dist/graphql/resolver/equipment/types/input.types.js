"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentCreateInput = exports.EquipmentsWhereInput = void 0;
const nexus_1 = require("nexus");
const typedef_1 = require("../../../../graphql/typedef");
exports.EquipmentsWhereInput = (0, nexus_1.inputObjectType)({
    name: "EquipmentsWhereInput",
    definition: (t) => {
        t.nullable.string("search");
    },
});
exports.EquipmentCreateInput = (0, nexus_1.inputObjectType)({
    name: "EquipmentCreateInput",
    definition: (t) => {
        t.nonNull.string("name");
        t.nonNull.string("serialNo");
        t.nonNull.string("hospitalId");
        t.string("assignedToId");
        t.nonNull.field("category", { type: typedef_1.EquipmentCategoryEnum });
        t.nonNull.field("state", { type: typedef_1.EquipmentStateEnum });
    },
});
//# sourceMappingURL=input.types.js.map