import { objectType } from "nexus";
import { Address, Hospital } from "nexus-prisma";

export const HospitalObjectType = objectType({
  name: Hospital.$name,
  definition(t) {
    t.string(Hospital.id.name);
    t.string(Hospital.name.name);
    t.string(Hospital.email.name);
    t.string(Hospital.phone.name);
    t.nullable.field(Hospital.address.name, { type: AddressObjectType });
    t.dateTime(Hospital.createdAt.name);
    t.dateTime(Hospital.updatedAt.name);
  },
});

export const HospitalsObjectType = objectType({
  name: HospitalObjectType.name + "s",
  definition(t) {
    t.list.nonNull.field("data", { type: HospitalObjectType });
    t.nonNull.int("count");
  },
});

export const AddressObjectType = objectType({
  name: Address.$name,
  definition(t) {
    t.string(Address.id.name);
    t.string(Address.address1.name);
    t.string(Address.address2.name);
    t.string(Address.province.name);
    t.nullable.field(Hospital.name.name, { type: HospitalObjectType });
    t.dateTime(Address.createdAt.name);
    t.dateTime(Address.updatedAt.name);
  },
});

export const HospitalOptionObjectType = objectType({
  name: "HospitalOption",
  definition(t) {
    t.string(Hospital.name.name);
    t.string(Hospital.id.name);
  },
});
