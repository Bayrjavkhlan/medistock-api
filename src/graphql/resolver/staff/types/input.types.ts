import { inputObjectType } from "nexus";
import { Staff } from "nexus-prisma";

import {
  EnumSortOrderType,
  EnumStaffRoleType,
} from "@/graphql/typedef/enum.types";

export const StaffsWhereInput = inputObjectType({
  name: "StaffsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.field("roleKey", { type: EnumStaffRoleType });
  },
});

export const StaffCreateInput = inputObjectType({
  name: "StaffCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("phone");
    t.nonNull.list.nonNull.field("roleKeys", { type: EnumStaffRoleType });
    t.nonNull.string("hospitalId");
  },
});

export const StaffsOrderByInput = inputObjectType({
  name: "StaffsOrderByInput",
  definition(t) {
    t.nullable.field(Staff.name.name, { type: EnumSortOrderType });
    t.nullable.field(Staff.email.name, { type: EnumSortOrderType });
  },
});
