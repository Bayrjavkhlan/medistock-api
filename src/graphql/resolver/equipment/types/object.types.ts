import { objectType } from "nexus";
import { Equipment } from "nexus-prisma";

import { HospitalObjectType } from "../../hospital";
import { UserObjectType } from "../../user";

export const EquipmentObjectType = objectType({
  name: Equipment.$name,
  definition(t) {
    t.string(Equipment.id.name);
    t.string(Equipment.name.name);
    t.string(Equipment.serialNo.name);
    // t.string(Equipment.description.name);
    t.nullable.field(Equipment.hospital.name, { type: HospitalObjectType });
    t.nullable.field(Equipment.assignedTo.name, { type: UserObjectType }); // ← FIXED
    t.string(Equipment.category.name);
    // t.nullable.field(Equipment.logs.name, { type: EquipmentLogObjectType });
    t.string(Equipment.state.name);
    t.dateTime(Equipment.createdAt.name);
    t.dateTime(Equipment.updatedAt.name);
  },
});

export const EquipementsObjectType = objectType({
  name: EquipmentObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: EquipmentObjectType });
    t.nonNull.int("count");
  },
});
