import { GraphQLError } from "graphql";

export const PharmacyErrorMap = {
  PHARMACY_NOT_FOUND: {
    code: "PHARMACY_NOT_FOUND",
    message: "Эмийн сан олдсонгүй",
  },
  DUPLICATE_PHARMACY: {
    code: "DUPLICATE_PHARMACY",
    message: "Бүртгэлтэй эмийн сан байна",
  },
};

export const PharmacyErrors = {
  PHARMACY_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(PharmacyErrorMap.PHARMACY_NOT_FOUND.message, {
      extensions: PharmacyErrorMap.PHARMACY_NOT_FOUND,
    }),
  DUPLICATE_PHARMACY: (): GraphQLError =>
    new GraphQLError(PharmacyErrorMap.DUPLICATE_PHARMACY.message, {
      extensions: PharmacyErrorMap.DUPLICATE_PHARMACY,
    }),
};
