import { GraphQLError } from "graphql";

import { CustomError } from "@/errors/types";

export const AuthErrorMap: CustomError = {
  NOT_AUTHORIZED: {
    code: "NOT_AUTHORIZED",
    message: "Хандах эрхгүй байна.",
  },
  INVALID_ACCESS_TOKEN: {
    code: "INVALID_ACCESS_TOKEN",
    message: "Буруу хандах токен байна. Дахин оролдоно уу",
  },
  ACCESS_TOKEN_EXPIRED: {
    code: "ACCESS_TOKEN_EXPIRED",
    message: "Хандах токены хугацаа дууссан байна. Дахин оролдоно уу",
  },
  REFRESH_TOKEN_EXPIRED: {
    code: "REFRESH_TOKEN_EXPIRED",
    message: "Сэргээх токены хугацаа дууссан байна. Дахин оролдоно уу",
  },
  INVALID_REFRESH_TOKEN: {
    code: "INVALID_REFRESH_TOKEN",
    message: "Сэргээх токен буруу байна. Дахин оролдоно уу",
  },
  WRONG_USERNAME_PASSWORD: {
    code: "WRONG_USERNAME_PASSWORD",
    message: "Нэвтрэх нэр эсвэл нууц үг буруу байна. Дахин оролдоно уу",
  },
};

export const AuthErrors = {
  NOT_AUTHORIZED: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.NOT_AUTHORIZED!.message, {
      extensions: AuthErrorMap.NOT_AUTHORIZED,
    }),
  INVALID_ACCESS_TOKEN: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.INVALID_ACCESS_TOKEN!.message, {
      extensions: AuthErrorMap.INVALID_ACCESS_TOKEN,
    }),
  ACCESS_TOKEN_EXPIRED: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.ACCESS_TOKEN_EXPIRED!.message, {
      extensions: AuthErrorMap.ACCESS_TOKEN_EXPIRED,
    }),
  REFRESH_TOKEN_EXPIRED: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.REFRESH_TOKEN_EXPIRED!.message, {
      extensions: AuthErrorMap.REFRESH_TOKEN_EXPIRED,
    }),
  INVALID_REFRESH_TOKEN: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.INVALID_REFRESH_TOKEN!.message, {
      extensions: AuthErrorMap.INVALID_REFRESH_TOKEN,
    }),
  WRONG_USERNAME_PASSWORD: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.WRONG_USERNAME_PASSWORD!.message, {
      extensions: AuthErrorMap.WRONG_USERNAME_PASSWORD,
    }),
};
