import { objectType } from "nexus";
import { Membership } from "nexus-prisma";

import { OrganizationRoleEnum } from "@/graphql/typedef";

import { OrganizationSummary } from "../../auth";
import { UserObjectType } from "../../user";

export const MembershipObjectType = objectType({
  name: Membership.$name,
  definition(t) {
    t.string(Membership.id.name);
    t.nonNull.field("role", { type: OrganizationRoleEnum });
    t.nonNull.field(Membership.user.name, { type: UserObjectType });
    t.nonNull.field(Membership.organization.name, {
      type: OrganizationSummary,
    });
    t.dateTime(Membership.createdAt.name);
  },
});

export const MembershipsObjectType = objectType({
  name: MembershipObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: MembershipObjectType });
    t.nonNull.int("count");
  },
});
