import { GraphQLError } from "graphql";

export const UserErrorMap = {
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "Хэрэглэгч олдсонгүй",
  },
  DUPLICATE_USER: {
    code: "DUPLICATE_USER",
    message: "Бүртгэлтэй хэрэглэгч байна",
  },
  USER_IN_USE: {
    code: "USER_IN_USE",
    message: "Хэрэглэгчийг устгах боломжгүй",
  },
  ROLE_REQUIRED: {
    code: "ROLE_REQUIRED",
    message: "Байгууллагын роль шаардлагатай",
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
};
