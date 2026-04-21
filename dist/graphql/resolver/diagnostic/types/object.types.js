"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticDoctorBookingListPayload = exports.DiagnosticPatientBookingListPayload = exports.DiagnosticBookingObjectType = exports.SymptomOptionsPayload = exports.SymptomOptionObjectType = exports.SymptomObjectType = exports.DiagnosticDoctorObjectType = exports.DiagnosticTestObjectType = exports.DiagnosticTimeSlotObjectType = exports.DiagnosticMedicationSuggestionObjectType = void 0;
const nexus_1 = require("nexus");
const drug_1 = require("../../drug");
const hospital_1 = require("../../hospital");
exports.DiagnosticMedicationSuggestionObjectType = (0, nexus_1.objectType)({
    name: "DiagnosticMedicationSuggestion",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.field("drug", { type: drug_1.DrugObjectType });
        t.nullable.string("note");
        t.nullable.string("linkUrl");
        t.nonNull.int("sortOrder");
    },
});
exports.DiagnosticTimeSlotObjectType = (0, nexus_1.objectType)({
    name: "DiagnosticTimeSlot",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("label");
        t.nonNull.string("startTime");
        t.nonNull.string("endTime");
        t.nonNull.int("capacity");
        t.nonNull.boolean("isActive");
    },
});
exports.DiagnosticTestObjectType = (0, nexus_1.objectType)({
    name: "DiagnosticTest",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("name");
        t.nullable.string("description");
        t.nullable.float("price");
        t.nullable.string("room");
        t.nullable.string("contact");
        t.nullable.string("instructions");
        t.nonNull.boolean("isActive");
        t.nullable.field("hospital", { type: hospital_1.HospitalObjectType });
        t.nullable.field("assignedDoctor", {
            type: exports.DiagnosticDoctorObjectType,
            resolve: (parent) => parent.assignedDoctor ?? null,
        });
        t.nonNull.list.nonNull.field("timeSlots", {
            type: exports.DiagnosticTimeSlotObjectType,
        });
    },
});
exports.DiagnosticDoctorObjectType = (0, nexus_1.objectType)({
    name: "DiagnosticDoctor",
    definition(t) {
        t.nonNull.string("id");
        t.string("name");
        t.string("email");
        t.string("phone");
    },
});
exports.SymptomObjectType = (0, nexus_1.objectType)({
    name: "Symptom",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("code");
        t.nonNull.string("name");
        t.nonNull.string("cause");
        t.nonNull.string("relief");
        t.nonNull.list.nonNull.field("medications", {
            type: exports.DiagnosticMedicationSuggestionObjectType,
        });
        t.nonNull.list.nonNull.field("tests", {
            type: exports.DiagnosticTestObjectType,
            resolve: (parent) => parent.tests.map((item) => item.diagnosticTest ?? item),
        });
    },
});
exports.SymptomOptionObjectType = (0, nexus_1.objectType)({
    name: "SymptomOption",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("code");
        t.nonNull.string("name");
    },
});
exports.SymptomOptionsPayload = (0, nexus_1.objectType)({
    name: "SymptomOptionsPayload",
    definition(t) {
        t.nonNull.list.nonNull.field("data", { type: exports.SymptomOptionObjectType });
        t.nonNull.int("count");
    },
});
exports.DiagnosticBookingObjectType = (0, nexus_1.objectType)({
    name: "DiagnosticBooking",
    definition(t) {
        t.nonNull.string("id");
        t.nullable.string("patientUserId");
        t.nonNull.string("patientName");
        t.nonNull.string("patientPhone");
        t.nonNull.string("department");
        t.nullable.string("doctorName");
        t.nonNull.dateTime("bookingTime");
        t.nonNull.string("status");
        t.nonNull.string("type");
        t.nullable.field("hospital", { type: hospital_1.HospitalObjectType });
        t.nullable.field("diagnosticTest", { type: exports.DiagnosticTestObjectType });
        t.nullable.field("diagnosticTimeSlot", {
            type: exports.DiagnosticTimeSlotObjectType,
        });
        t.nonNull.dateTime("createdAt");
        t.nonNull.dateTime("updatedAt");
    },
});
exports.DiagnosticPatientBookingListPayload = (0, nexus_1.objectType)({
    name: "DiagnosticPatientBookingListPayload",
    definition(t) {
        t.nonNull.list.nonNull.field("data", { type: exports.DiagnosticBookingObjectType });
        t.nonNull.int("count");
    },
});
exports.DiagnosticDoctorBookingListPayload = (0, nexus_1.objectType)({
    name: "DiagnosticDoctorBookingListPayload",
    definition(t) {
        t.nonNull.list.nonNull.field("data", { type: exports.DiagnosticBookingObjectType });
        t.nonNull.int("count");
    },
});
//# sourceMappingURL=object.types.js.map