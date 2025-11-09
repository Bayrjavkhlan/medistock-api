import { GraphQLError } from "graphql";

export const HospitalErrorMap = {
  HOSPITAL_NOT_FOUND: {
    code: "HOSPITAL_NOT_FOUND",
    message: "Эмнэлэг олдсонгүй",
  },
  HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: {
    code: "HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL",
    message: "Эмнэлгийн админд хамааралтай эмнэлэг олдсонгүй",
  },
};

export const HospitalErrors = {
  HOSPITAL_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(HospitalErrorMap.HOSPITAL_NOT_FOUND.message, {
      extensions: HospitalErrorMap.HOSPITAL_NOT_FOUND,
    }),
  HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: (): GraphQLError =>
    new GraphQLError(
      HospitalErrorMap.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL.message,
      {
        extensions: HospitalErrorMap.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL,
      }
    ),
};
