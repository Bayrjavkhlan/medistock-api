import { objectType } from "nexus";
import { EquipmentLog } from "nexus-prisma";

import { EquipmentObjectType } from "../../equipment/types";
import { UserObjectType } from "../../user";

export const EquipmentLogObjectType = objectType({
  name: EquipmentLog.$name,
  definition(t) {
    t.string(EquipmentLog.id.name);
    t.nullable.field(EquipmentLog.equipment.name, {
      type: EquipmentObjectType,
    });
    t.nullable.field(EquipmentLog.performedBy.name, { type: UserObjectType });
    t.string(EquipmentLog.userId.name);
    t.string(EquipmentLog.description.name);
    t.dateTime(EquipmentLog.createdAt.name);
    t.dateTime(EquipmentLog.updatedAt.name);
  },
});

export const EquipmentLogsObjectType = objectType({
  name: EquipmentLogObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: EquipmentLogObjectType });
    t.nonNull.int("count");
  },
});
