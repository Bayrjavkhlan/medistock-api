import { inputObjectType } from "nexus";

import { EquipmentLogTypeEnum } from "@/graphql/typedef";

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
    t.nonNull.string("description");
    t.field("type", { type: EquipmentLogTypeEnum });
    t.dateTime("faultDate");
    t.string("problem");
    t.string("repairAction");
    t.string("status");
  },
});

export const EquipmentLogUpdateInput = inputObjectType({
  name: "EquipmentLogUpdateInput",
  definition(t) {
    t.nonNull.string("description");
    t.field("type", { type: EquipmentLogTypeEnum });
    t.dateTime("faultDate");
    t.string("problem");
    t.string("repairAction");
    t.string("status");
  },
});
