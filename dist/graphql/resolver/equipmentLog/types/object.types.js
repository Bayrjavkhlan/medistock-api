"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogsObjectType = exports.EquipmentLogObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const types_1 = require("../../equipment/types");
const user_1 = require("../../user");
exports.EquipmentLogObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.EquipmentLog.$name,
    definition(t) {
        t.string(nexus_prisma_1.EquipmentLog.id.name);
        t.nullable.field(nexus_prisma_1.EquipmentLog.equipment.name, {
            type: types_1.EquipmentObjectType,
        });
        t.nullable.field(nexus_prisma_1.EquipmentLog.performedBy.name, { type: user_1.UserObjectType });
        t.string(nexus_prisma_1.EquipmentLog.description.name);
        t.dateTime(nexus_prisma_1.EquipmentLog.createdAt.name);
    },
});
exports.EquipmentLogsObjectType = (0, nexus_1.objectType)({
    name: exports.EquipmentLogObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.EquipmentLogObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map