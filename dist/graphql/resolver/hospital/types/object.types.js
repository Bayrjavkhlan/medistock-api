"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalOptionObjectType = exports.AddressObjectType = exports.HospitalsObjectType = exports.HospitalObjectType = void 0;
const nexus_1 = require("nexus");
const nexus_prisma_1 = require("nexus-prisma");
exports.HospitalObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Hospital.$name,
    definition(t) {
        t.string(nexus_prisma_1.Hospital.id.name);
        t.string("name", {
            resolve: (hospital) => hospital.organization?.name ?? null,
        });
        t.string(nexus_prisma_1.Hospital.email.name);
        t.string(nexus_prisma_1.Hospital.phone.name);
        t.nullable.field("address", {
            type: exports.AddressObjectType,
            resolve: (hospital) => hospital.organization?.address ?? null,
        });
        t.dateTime(nexus_prisma_1.Hospital.createdAt.name);
        t.dateTime(nexus_prisma_1.Hospital.updatedAt.name);
    },
});
exports.HospitalsObjectType = (0, nexus_1.objectType)({
    name: exports.HospitalObjectType.name + "s",
    definition(t) {
        t.list.nonNull.field("data", { type: exports.HospitalObjectType });
        t.nonNull.int("count");
    },
});
exports.AddressObjectType = (0, nexus_1.objectType)({
    name: nexus_prisma_1.Address.$name,
    definition(t) {
        t.string(nexus_prisma_1.Address.id.name);
        t.string(nexus_prisma_1.Address.address1.name);
        t.string(nexus_prisma_1.Address.address2.name);
        t.string(nexus_prisma_1.Address.province.name);
        t.float(nexus_prisma_1.Address.latitude.name);
        t.float(nexus_prisma_1.Address.longitude.name);
        t.dateTime(nexus_prisma_1.Address.createdAt.name);
        t.dateTime(nexus_prisma_1.Address.updatedAt.name);
    },
});
exports.HospitalOptionObjectType = (0, nexus_1.objectType)({
    name: "HospitalOption",
    definition(t) {
        t.string("name");
        t.string("id");
    },
});
//# sourceMappingURL=object.types.js.map