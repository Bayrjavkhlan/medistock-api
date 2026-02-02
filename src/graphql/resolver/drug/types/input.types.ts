import { inputObjectType } from "nexus";

export const DrugsWhereInput = inputObjectType({
  name: "DrugsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
  },
});

export const PharmacyDrugsWhereInput = inputObjectType({
  name: "PharmacyDrugsWhereInput",
  definition: (t) => {
    t.nullable.string("search");
  },
});

export const DrugCreateInput = inputObjectType({
  name: "DrugCreateInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.string("genericName");
    t.string("dosageForm");
    t.string("strength");
    t.string("manufacturer");
    t.string("description");
  },
});
