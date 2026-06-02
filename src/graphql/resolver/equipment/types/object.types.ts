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
    t.nullable.string(Equipment.brand.name);
    t.nullable.string(Equipment.model.name);
    t.nullable.int(Equipment.manufacturedYear.name);
    t.nullable.dateTime(Equipment.commissionedDate.name);
    t.nullable.dateTime(Equipment.endOfLifeDate.name);
    t.nullable.string(Equipment.passportDocument.name);
    t.nullable.string(Equipment.usageManualDocument.name);
    t.nullable.string(Equipment.calibrationInstructionDocument.name);
    t.nullable.string(Equipment.maintenancePlan.name);
    t.nullable.string(Equipment.requiredParts.name);
    t.nullable.string(Equipment.usedParts.name);
    t.nullable.string(Equipment.sparePartsStock.name);
    t.nullable.field(Equipment.hospital.name, { type: HospitalObjectType });
    t.nullable.field(Equipment.assignedTo.name, { type: UserObjectType });
    t.string(Equipment.category.name);
    t.string(Equipment.state.name);
    t.list.field(Equipment.logs.name, { type: "EquipmentLog" });
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
