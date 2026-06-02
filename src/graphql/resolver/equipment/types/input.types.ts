import { inputObjectType } from "nexus";

import { EquipmentCategoryEnum, EquipmentStateEnum } from "@/graphql/typedef";

export const EquipmentsWhereInput = inputObjectType({
  name: "EquipmentsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
  },
});

export const EquipmentCreateInput = inputObjectType({
  name: "EquipmentCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("serialNo");
    t.string("brand");
    t.string("model");
    t.int("manufacturedYear");
    t.dateTime("commissionedDate");
    t.dateTime("endOfLifeDate");
    t.string("passportDocument");
    t.string("usageManualDocument");
    t.string("calibrationInstructionDocument");
    t.string("maintenancePlan");
    t.string("requiredParts");
    t.string("usedParts");
    t.string("sparePartsStock");
    t.nonNull.string("hospitalId");
    t.string("assignedToId");
    t.nonNull.field("category", { type: EquipmentCategoryEnum });
    t.nonNull.field("state", { type: EquipmentStateEnum });
  },
});
