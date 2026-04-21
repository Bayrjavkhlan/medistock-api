"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingErrors = exports.BookingErrorMap = void 0;
const graphql_1 = require("graphql");
exports.BookingErrorMap = {
    BOOKING_NOT_FOUND: {
        code: "BOOKING_NOT_FOUND",
        message: "Захиалга олдсонгүй",
    },
};
exports.BookingErrors = {
    BOOKING_NOT_FOUND: () => new graphql_1.GraphQLError(exports.BookingErrorMap.BOOKING_NOT_FOUND.message, {
        extensions: exports.BookingErrorMap.BOOKING_NOT_FOUND,
    }),
};
//# sourceMappingURL=booking.js.map