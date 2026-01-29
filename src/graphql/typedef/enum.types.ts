import {
  BookingStatus,
  EquipmentCategory,
  EquipmentState,
  OrganizationRole,
  OrganizationType,
  Prisma,
} from "@prisma/client";
import { enumType } from "nexus";

export const OrganizationRoleEnum = enumType({
  name: "OrganizationRole",
  members: Object.values(OrganizationRole),
});

export const OrganizationTypeEnum = enumType({
  name: "OrganizationType",
  members: Object.values(OrganizationType),
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

export const BookingStatusEnum = enumType({
  name: "BookingStatus",
  members: Object.values(BookingStatus),
});
