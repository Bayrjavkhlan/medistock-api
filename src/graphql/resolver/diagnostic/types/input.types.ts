import { inputObjectType } from "nexus";

export const DiagnosticBookingCreateInput = inputObjectType({
  name: "DiagnosticBookingCreateInput",
  definition: (t) => {
    t.nonNull.string("diagnosticTestId");
    t.nonNull.string("diagnosticTimeSlotId");
    t.nonNull.string("bookingDate");
    t.nonNull.string("patientName");
    t.nonNull.string("patientPhone");
    t.nullable.string("note");
  },
});
