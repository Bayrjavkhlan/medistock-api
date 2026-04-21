"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipementsObjectType = exports.EquipmentObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
const hospital_1 = require("../../hospital");
const user_1 = require("../../user");
exports.EquipmentObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Equipment.$name,
    definition(t) {
        t.string(nexus_prisma_1.Equipment.id.name);
        t.string(nexus_prisma_1.Equipment.name.name);
        t.string(nexus_prisma_1.Equipment.serialNo.name);
        // t.string(Equipment.description.name);
        t.nullable.field(nexus_prisma_1.Equipment.hospital.name, { type: hospital_1.HospitalObjectType });
        t.nullable.field(nexus_prisma_1.Equipment.assignedTo.name, { type: user_1.UserObjectType });
        t.string(nexus_prisma_1.Equipment.category.name);
        // t.nullable.field(Equipment.logs.name, { type: EquipmentLogObjectType });
        t.string(nexus_prisma_1.Equipment.state.name);
        t.dateTime(nexus_prisma_1.Equipment.createdAt.name);
        t.dateTime(nexus_prisma_1.Equipment.updatedAt.name);
    },
});
exports.EquipementsObjectType = (0, nexus_1.objectType)({
    name: exports.EquipmentObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.EquipmentObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map