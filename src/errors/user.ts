import { GraphQLError } from "graphql";

import { CustomError } from "@/errors/types";

export const UserErrorMap: CustomError = {
  DATA_NOT_FOUND: {
    code: "DATA_NOT_FOUND",
    message: "Дата олдсонгүй",
  },
  CAN_NOT_USER_CREATE: {
    code: "CAN_NOT_USER_CREATE",
    message: "Хэрэглэгч үүсгэх боломжгүй байна",
  },
  DUPLICATED_USER_EMAIL: {
    code: "DUPLICATED_USER_EMAIL",
    message: "Бүртгэлтэй хэрэглэгч байна",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "Хэрэглэгч олдсонгүй",
  },
};

export const UserErrors = {
  DATA_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(UserErrorMap.DATA_NOT_FOUND!.message, {
      extensions: UserErrorMap.DATA_NOT_FOUND,
    }),
  CAN_NOT_USER_CREATE: (): GraphQLError =>
    new GraphQLError(UserErrorMap.CAN_NOT_USER_CREATE!.message, {
      extensions: UserErrorMap.CAN_NOT_USER_CREATE,
    }),
  DUPLICATED_USER_EMAIL: (): GraphQLError =>
    new GraphQLError(UserErrorMap.DUPLICATED_USER_EMAIL!.message, {
      extensions: UserErrorMap.DUPLICATED_USER_EMAIL,
    }),
  USER_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(UserErrorMap.USER_NOT_FOUND!.message, {
      extensions: UserErrorMap.USER_NOT_FOUND,
    }),
};
