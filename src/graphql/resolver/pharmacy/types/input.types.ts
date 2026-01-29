import { inputObjectType } from "nexus";

import { AddressCreateInput } from "../../hospital";

export const PharmaciesWhereInput = inputObjectType({
  name: "PharmaciesWhereInput",
  definition: (t) => {
    t.nullable.string("search");
  },
});

export const PharmacyCreateInput = inputObjectType({
  name: "PharmacyCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("phone");
    t.nonNull.email("email");
    t.nonNull.field("address", { type: AddressCreateInput });
  },
});
