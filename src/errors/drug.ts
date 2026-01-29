import { GraphQLError } from "graphql";

export const DrugErrorMap = {
  DRUG_NOT_FOUND: {
    code: "DRUG_NOT_FOUND",
    message: "Эм олдсонгүй",
  },
  DUPLICATE_DRUG: {
    code: "DUPLICATE_DRUG",
    message: "Бүртгэлтэй эм байна",
  },
};

export const DrugErrors = {
  DRUG_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(DrugErrorMap.DRUG_NOT_FOUND.message, {
      extensions: DrugErrorMap.DRUG_NOT_FOUND,
    }),
  DUPLICATE_DRUG: (): GraphQLError =>
    new GraphQLError(DrugErrorMap.DUPLICATE_DRUG.message, {
      extensions: DrugErrorMap.DUPLICATE_DRUG,
    }),
};
