import { GraphQLError } from "graphql";

export const UserErrorMap = {
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "Хэрэглэгч олдсонгүй.",
  },
  DUPLICATE_USER: {
    code: "DUPLICATE_USER",
    message: "Ижил мэдээлэлтэй хэрэглэгч аль хэдийн байна.",
  },
  USER_IN_USE: {
    code: "USER_IN_USE",
    message: "Энэ хэрэглэгчийг устгах боломжгүй байна.",
  },
  ROLE_REQUIRED: {
    code: "ROLE_REQUIRED",
    message: "Байгууллагын үүрэг заавал шаардлагатай.",
  },
  NAME_REQUIRED: {
    code: "NAME_REQUIRED",
    message: "Нэрээ оруулна уу.",
  },
  INVALID_EMAIL: {
    code: "INVALID_EMAIL",
    message: "И-мэйл хаягийн формат буруу байна.",
  },
  WEAK_PASSWORD: {
    code: "WEAK_PASSWORD",
    message:
      "Нууц үг дор хаяж 8 тэмдэгттэй, 1 том үсэг, 1 жижиг үсэг, 1 тоо агуулсан байх ёстой.",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "Энэ и-мэйл хаяг аль хэдийн бүртгэлтэй байна.",
  },
  EMAIL_ALREADY_VERIFIED: {
    code: "EMAIL_ALREADY_VERIFIED",
    message: "И-мэйл хаяг аль хэдийн баталгаажсан байна.",
  },
};

export const UserErrors = {
  USER_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(UserErrorMap.USER_NOT_FOUND.message, {
      extensions: UserErrorMap.USER_NOT_FOUND,
    }),
  DUPLICATE_USER: (): GraphQLError =>
    new GraphQLError(UserErrorMap.DUPLICATE_USER.message, {
      extensions: UserErrorMap.DUPLICATE_USER,
    }),
  USER_IN_USE: (): GraphQLError =>
    new GraphQLError(UserErrorMap.USER_IN_USE.message, {
      extensions: UserErrorMap.USER_IN_USE,
    }),
  ROLE_REQUIRED: (): GraphQLError =>
    new GraphQLError(UserErrorMap.ROLE_REQUIRED.message, {
      extensions: UserErrorMap.ROLE_REQUIRED,
    }),
  NAME_REQUIRED: (): GraphQLError =>
    new GraphQLError(UserErrorMap.NAME_REQUIRED.message, {
      extensions: UserErrorMap.NAME_REQUIRED,
    }),
  INVALID_EMAIL: (): GraphQLError =>
    new GraphQLError(UserErrorMap.INVALID_EMAIL.message, {
      extensions: UserErrorMap.INVALID_EMAIL,
    }),
  WEAK_PASSWORD: (): GraphQLError =>
    new GraphQLError(UserErrorMap.WEAK_PASSWORD.message, {
      extensions: UserErrorMap.WEAK_PASSWORD,
    }),
  EMAIL_ALREADY_EXISTS: (): GraphQLError =>
    new GraphQLError(UserErrorMap.EMAIL_ALREADY_EXISTS.message, {
      extensions: UserErrorMap.EMAIL_ALREADY_EXISTS,
    }),
  EMAIL_ALREADY_VERIFIED: (): GraphQLError =>
    new GraphQLError(UserErrorMap.EMAIL_ALREADY_VERIFIED.message, {
      extensions: UserErrorMap.EMAIL_ALREADY_VERIFIED,
    }),
};
