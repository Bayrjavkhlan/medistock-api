"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticBookingCreateInput = void 0;
const nexus_1 = require("nexus");
exports.DiagnosticBookingCreateInput = (0, nexus_1.inputObjectType)({
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
//# sourceMappingURL=input.types.js.map