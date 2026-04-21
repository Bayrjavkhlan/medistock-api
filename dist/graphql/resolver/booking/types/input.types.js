"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCreateInput = exports.BookingsWhereInput = void 0;
const nexus_1 = require("nexus");
const typedef_1 = require("../../../../graphql/typedef");
exports.BookingsWhereInput = (0, nexus_1.inputObjectType)({
    name: "BookingsWhereInput",
    definition: (t) => {
        t.nullable.string("search");
        t.nullable.string("hospitalId");
        t.nullable.field("status", { type: typedef_1.BookingStatusEnum });
    },
});
exports.BookingCreateInput = (0, nexus_1.inputObjectType)({
    name: "BookingCreateInput",
    definition: (t) => {
        t.nonNull.string("hospitalId");
        t.nonNull.string("patientName");
        t.nonNull.string("patientPhone");
        t.nonNull.string("department");
        t.string("doctorName");
        t.nonNull.dateTime("bookingTime");
        t.nonNull.field("status", { type: typedef_1.BookingStatusEnum });
    },
});
//# sourceMappingURL=input.types.js.map