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
    t.nonNull.string("hospitalId");
    t.nonNull.string("staffId");
    t.nonNull.field("category", { type: EquipmentCategoryEnum });
    t.nonNull.field("state", { type: EquipmentStateEnum });
  },
});

// export const EquipmentUpdateInput = inputObjectType({
//   name: "EquipmentUpdateInput",
//   definition(t) {
//     t.string("name");
//     t.string("serialNo");
//     t.string("hospitalId");
//     t.nullable.string("userId");
//     t.field("category", { type: EquipmentCategoryEnum });
//     t.field("state", { type: EquipmentStateEnum });
//   },
// });
