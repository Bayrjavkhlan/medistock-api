import { EnumUserRole, Prisma } from "@prisma/client";
import { enumType } from "nexus";

export const EnumUserRoleType = enumType({
  name: "EnumUserRole",
  members: Object.values(EnumUserRole),
});
export const EnumSortOrderType = enumType({
  name: "EnumSortOrder",
  members: [Prisma.SortOrder.asc, Prisma.SortOrder.desc],
});
