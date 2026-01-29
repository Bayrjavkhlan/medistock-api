import { inputObjectType } from "nexus";

import { OrganizationRoleEnum } from "@/graphql/typedef";

export const MembershipCreateInput = inputObjectType({
  name: "MembershipCreateInput",
  definition: (t) => {
    t.nonNull.string("userId");
    t.nonNull.field("role", { type: OrganizationRoleEnum });
  },
});

export const MembershipUpdateInput = inputObjectType({
  name: "MembershipUpdateInput",
  definition: (t) => {
    t.nonNull.field("role", { type: OrganizationRoleEnum });
  },
});
