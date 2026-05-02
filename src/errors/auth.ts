import { GraphQLError } from "graphql";

import { CustomError } from "@/errors/types";

export const AuthErrorMap: CustomError = {
  NOT_AUTHORIZED: {
    code: "NOT_AUTHORIZED",
    message: "Хандах эрхгүй байна.",
  },
  INVALID_ACCESS_TOKEN: {
    code: "INVALID_ACCESS_TOKEN",
    message: "Нэвтрэх эрхийн токен буруу байна. Дахин оролдоно уу.",
  },
  ACCESS_TOKEN_EXPIRED: {
    code: "ACCESS_TOKEN_EXPIRED",
    message: "Нэвтрэх эрхийн токены хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
  },
  REFRESH_TOKEN_EXPIRED: {
    code: "REFRESH_TOKEN_EXPIRED",
    message: "Сэргээх токены хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
  },
  INVALID_REFRESH_TOKEN: {
    code: "INVALID_REFRESH_TOKEN",
    message: "Сэргээх токен буруу байна. Дахин нэвтэрнэ үү.",
  },
  WRONG_USERNAME_PASSWORD: {
    code: "WRONG_USERNAME_PASSWORD",
    message: "И-мэйл эсвэл нууц үг буруу байна. Дахин оролдоно уу.",
  },
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    message: "И-мэйл хаягаа баталгаажуулсны дараа нэвтэрнэ үү.",
  },
  INVALID_OTP: {
    code: "INVALID_OTP",
    message: "Баталгаажуулах код буруу байна.",
  },
  OTP_EXPIRED: {
    code: "OTP_EXPIRED",
    message: "Баталгаажуулах кодын хугацаа дууссан байна. Дахин код авна уу.",
  },
  OTP_RESEND_TOO_SOON: {
    code: "OTP_RESEND_TOO_SOON",
    message: "Шинэ код хүсэхээсээ өмнө түр хүлээнэ үү.",
  },
  TOO_MANY_OTP_ATTEMPTS: {
    code: "TOO_MANY_OTP_ATTEMPTS",
    message:
      "Кодыг олон удаа буруу оруулсан байна. Шинэ баталгаажуулах код авна уу.",
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
  EMAIL_NOT_VERIFIED: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.EMAIL_NOT_VERIFIED!.message, {
      extensions: AuthErrorMap.EMAIL_NOT_VERIFIED,
    }),
  INVALID_OTP: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.INVALID_OTP!.message, {
      extensions: AuthErrorMap.INVALID_OTP,
    }),
  OTP_EXPIRED: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.OTP_EXPIRED!.message, {
      extensions: AuthErrorMap.OTP_EXPIRED,
    }),
  OTP_RESEND_TOO_SOON: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.OTP_RESEND_TOO_SOON!.message, {
      extensions: AuthErrorMap.OTP_RESEND_TOO_SOON,
    }),
  TOO_MANY_OTP_ATTEMPTS: (): GraphQLError =>
    new GraphQLError(AuthErrorMap.TOO_MANY_OTP_ATTEMPTS!.message, {
      extensions: AuthErrorMap.TOO_MANY_OTP_ATTEMPTS,
    }),
};
