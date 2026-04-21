import { objectType } from "nexus";

import { DrugObjectType } from "../../drug";
import { HospitalObjectType } from "../../hospital";

export const DiagnosticMedicationSuggestionObjectType = objectType({
  name: "DiagnosticMedicationSuggestion",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("drug", { type: DrugObjectType });
    t.nullable.string("note");
    t.nullable.string("linkUrl");
    t.nonNull.int("sortOrder");
  },
});

export const DiagnosticTimeSlotObjectType = objectType({
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

export const DiagnosticTestObjectType = objectType({
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
    t.nullable.field("hospital", { type: HospitalObjectType });
    t.nullable.field("assignedDoctor", {
      type: DiagnosticDoctorObjectType,
      resolve: (parent: any) => parent.assignedDoctor ?? null,
    });
    t.nonNull.list.nonNull.field("timeSlots", {
      type: DiagnosticTimeSlotObjectType,
    });
  },
});

export const DiagnosticDoctorObjectType = objectType({
  name: "DiagnosticDoctor",
  definition(t) {
    t.nonNull.string("id");
    t.string("name");
    t.string("email");
    t.string("phone");
  },
});

export const SymptomObjectType = objectType({
  name: "Symptom",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("code");
    t.nonNull.string("name");
    t.nonNull.string("cause");
    t.nonNull.string("relief");
    t.nonNull.list.nonNull.field("medications", {
      type: DiagnosticMedicationSuggestionObjectType,
    });
    t.nonNull.list.nonNull.field("tests", {
      type: DiagnosticTestObjectType,
      resolve: (parent: any) =>
        parent.tests.map((item: any) => item.diagnosticTest ?? item),
    });
  },
});

export const SymptomOptionObjectType = objectType({
  name: "SymptomOption",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("code");
    t.nonNull.string("name");
  },
});

export const SymptomOptionsPayload = objectType({
  name: "SymptomOptionsPayload",
  definition(t) {
    t.nonNull.list.nonNull.field("data", { type: SymptomOptionObjectType });
    t.nonNull.int("count");
  },
});

export const DiagnosticBookingObjectType = objectType({
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
    t.nullable.field("hospital", { type: HospitalObjectType });
    t.nullable.field("diagnosticTest", { type: DiagnosticTestObjectType });
    t.nullable.field("diagnosticTimeSlot", {
      type: DiagnosticTimeSlotObjectType,
    });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});

export const DiagnosticPatientBookingListPayload = objectType({
  name: "DiagnosticPatientBookingListPayload",
  definition(t) {
    t.nonNull.list.nonNull.field("data", { type: DiagnosticBookingObjectType });
    t.nonNull.int("count");
  },
});

export const DiagnosticDoctorBookingListPayload = objectType({
  name: "DiagnosticDoctorBookingListPayload",
  definition(t) {
    t.nonNull.list.nonNull.field("data", { type: DiagnosticBookingObjectType });
    t.nonNull.int("count");
  },
});
