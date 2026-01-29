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
  DUPLICATE_HOSPITAL: {
    code: "DUPLICATE_HOSPITAL",
    message: "Бүртгэлтэй эмнэлэг байна",
  },
  MEMBER_NOT_IN_ORGANIZATION: {
    code: "MEMBER_NOT_IN_ORGANIZATION",
    message: "Хэрэглэгч тухайн байгууллагад харьяалагдаагүй байна",
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
  DUPLICATE_HOSPITAL: (): GraphQLError =>
    new GraphQLError(HospitalErrorMap.DUPLICATE_HOSPITAL.message, {
      extensions: HospitalErrorMap.DUPLICATE_HOSPITAL,
    }),
  MEMBER_NOT_IN_ORGANIZATION: (): GraphQLError =>
    new GraphQLError(HospitalErrorMap.MEMBER_NOT_IN_ORGANIZATION.message, {
      extensions: HospitalErrorMap.MEMBER_NOT_IN_ORGANIZATION,
    }),
};
