import { objectType } from "nexus";
import { Address, Hospital } from "nexus-prisma";

export const HospitalObjectType = objectType({
  name: Hospital.$name,
  definition(t) {
    t.string(Hospital.id.name);
    t.string("name", {
      resolve: (hospital: any) => hospital.organization?.name ?? null,
    });
    t.string(Hospital.email.name);
    t.string(Hospital.phone.name);
    t.nullable.field("address", {
      type: AddressObjectType,
      resolve: (hospital: any) => hospital.organization?.address ?? null,
    });
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
    t.dateTime(Address.createdAt.name);
    t.dateTime(Address.updatedAt.name);
  },
});

export const HospitalOptionObjectType = objectType({
  name: "HospitalOption",
  definition(t) {
    t.string("name");
    t.string("id");
  },
});
