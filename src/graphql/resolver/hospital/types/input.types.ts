import { inputObjectType } from "nexus";

export const HospitalsWhereInput = inputObjectType({
  name: "HospitalsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
    t.nullable.string("address");
  },
});

// export const HospitalWhereInput = inputObjectType({
//   name: "HospitalWhereInput",
//   definition: (t) => {
//     t.nonNull.string("name");
//     t.nonNull.string("email");
//     t.nonNull.string("phone");
//   },
// });

export const HospitalCreateInput = inputObjectType({
  name: "HospitalCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("phone");
    t.nonNull.email("email");
    t.nonNull.field("address", {
      type: AddressCreateInput,
    });
  },
});

export const HospitalUpdateInput = inputObjectType({
  name: "HospitalUpdateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.string("phone");
    t.nonNull.email("email");
    t.nonNull.field("address", {
      type: AddressUpdateInput,
    });
  },
});

export const AddressCreateInput = inputObjectType({
  name: "AddressCreateInput",
  definition(t) {
    t.nonNull.string("address1");
    t.string("address2");
    t.nonNull.string("province");
    t.float("latitude");
    t.float("longitude");
  },
});

export const AddressUpdateInput = inputObjectType({
  name: "AddressUpdateInput",
  definition(t) {
    t.nonNull.string("address1");
    t.string("address2");
    t.nonNull.string("province");
    t.float("latitude");
    t.float("longitude");
  },
});
