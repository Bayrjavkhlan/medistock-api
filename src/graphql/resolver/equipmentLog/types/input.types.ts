import { inputObjectType } from "nexus";

export const EquipmentLogsWhereInput = inputObjectType({
  name: "EquipmentLogsWhereInput",
  definition(t) {
    t.nullable.string("search");
  },
});

export const EquipmentLogCreateInput = inputObjectType({
  name: "EquipmentLogCreateInput",
  definition(t) {
    t.nonNull.string("equipmentId");
    t.nonNull.string("staffId");
    t.nonNull.string("description");
  },
});

export const EquipmentLogUpdateInput = inputObjectType({
  name: "EquipmentLogUpdateInput",
  definition(t) {
    t.nonNull.string("description");
  },
});
