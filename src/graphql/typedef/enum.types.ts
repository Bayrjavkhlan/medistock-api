import {
  EnumStaffRole,
  EquipmentCategory,
  EquipmentState,
  Prisma,
} from "@prisma/client";
import { enumType } from "nexus";

export const EnumStaffRoleType = enumType({
  name: "EnumStaffRole",
  members: Object.values(EnumStaffRole),
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
