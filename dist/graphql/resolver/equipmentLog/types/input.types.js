"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogUpdateInput = exports.EquipmentLogCreateInput = exports.EquipmentLogsWhereInput = void 0;
const nexus_1 = require("nexus");
exports.EquipmentLogsWhereInput = (0, nexus_1.inputObjectType)({
    name: "EquipmentLogsWhereInput",
    definition(t) {
        t.nullable.string("search");
    },
});
exports.EquipmentLogCreateInput = (0, nexus_1.inputObjectType)({
    name: "EquipmentLogCreateInput",
    definition(t) {
        t.nonNull.string("equipmentId");
        t.nonNull.string("description");
    },
});
exports.EquipmentLogUpdateInput = (0, nexus_1.inputObjectType)({
    name: "EquipmentLogUpdateInput",
    definition(t) {
        t.nonNull.string("description");
    },
});
//# sourceMappingURL=input.types.js.map