import { objectType } from "nexus";
import { Staff } from "nexus-prisma";

import { RoleObjectType } from "@/graphql/resolver/auth";
import { HospitalObjectType } from "@/graphql/resolver/hospital";

export const StaffObjectType = objectType({
  name: Staff.$name,
  definition(t) {
    t.string(Staff.id.name);
    t.string(Staff.name.name);
    t.string(Staff.email.name);
    t.string(Staff.phone.name);
    t.list.field(Staff.roles.name, { type: RoleObjectType });

    t.nullable.field(Staff.hospital.name, { type: HospitalObjectType });

    t.dateTime(Staff.createdAt.name);
    t.dateTime(Staff.updatedAt.name);
  },
});

export const StaffsObjectType = objectType({
  name: "StaffObjectType",
  definition(t) {
    t.list.nonNull.field("data", { type: StaffObjectType });
    t.nonNull.int("count");
  },
});
