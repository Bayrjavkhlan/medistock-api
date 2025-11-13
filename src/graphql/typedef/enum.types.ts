import {
  EnumUserRole,
  EquipmentCategory,
  EquipmentState,
  Prisma,
} from "@prisma/client";
import { enumType } from "nexus";

export const EnumUserRoleType = enumType({
  name: "EnumUserRole",
  members: Object.values(EnumUserRole),
});

export const EnumSortOrderType = enumType({
  name: "EnumSortOrder",
  members: [Prisma.SortOrder.asc, Prisma.SortOrder.desc],
});

export const EquipmentCategoryEnum = enumType({
  name: "EquipmentCategory",
  members: Object.values(EquipmentCategory),
});

export const EquipmentStateEnum = enumType({
  name: "EquipmentState",
  members: Object.values(EquipmentState),
});
