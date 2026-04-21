import { GraphQLError } from "graphql";

export const BookingErrorMap = {
  BOOKING_NOT_FOUND: {
    code: "BOOKING_NOT_FOUND",
    message: "Захиалга олдсонгүй",
  },
};

export const BookingErrors = {
  BOOKING_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(BookingErrorMap.BOOKING_NOT_FOUND.message, {
      extensions: BookingErrorMap.BOOKING_NOT_FOUND,
    }),
};
