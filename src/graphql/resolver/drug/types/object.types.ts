import { objectType } from "nexus";
import { Drug } from "nexus-prisma";

export const DrugObjectType = objectType({
  name: Drug.$name,
  definition(t) {
    t.string(Drug.id.name);
    t.string(Drug.name.name);
    t.string(Drug.genericName.name);
    t.string(Drug.dosageForm.name);
    t.string(Drug.strength.name);
    t.string(Drug.manufacturer.name);
    t.string(Drug.description.name);
    t.dateTime(Drug.createdAt.name);
    t.dateTime(Drug.updatedAt.name);
  },
});

export const DrugsObjectType = objectType({
  name: DrugObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: DrugObjectType });
    t.nonNull.int("count");
  },
});
