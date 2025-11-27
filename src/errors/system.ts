import { GraphQLError } from "graphql";

export const SystemErrorMap = {
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Системийн алдаа гарлаа.",
  },
  DATA_NOT_FOUND: {
    code: "DATA_NOT_FOUND",
    message: "Мэдээлэл олдсонгүй",
  },
  PERMISSION_DENIED: {
    code: "PERMISSION_DENIED",
    message: "Хандах эрхгүй permission",
  },
  ACCESS_DENIED: {
    code: "ACCESS_DENIED",
    message: "Хандах эрхгүй access",
  },
  TOO_MANY_REQUESTS: {
    code: "TOO_MANY_REQUESTS",
    message: "Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу.",
    httpStatus: 429,
  },
};

export const SystemErrors = {
  INTERNAL_SERVER_ERROR: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.INTERNAL_SERVER_ERROR.message, {
      extensions: { code: SystemErrorMap.INTERNAL_SERVER_ERROR.code },
    }),
  DATA_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.DATA_NOT_FOUND.message, {
      extensions: { code: SystemErrorMap.DATA_NOT_FOUND.code },
    }),
  PERMISSION_DENIED: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.PERMISSION_DENIED.message, {
      extensions: { code: SystemErrorMap.PERMISSION_DENIED.code },
    }),
  ACCESS_DENIED: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.ACCESS_DENIED.message, {
      extensions: { code: SystemErrorMap.ACCESS_DENIED.code },
    }),
  TOO_MANY_REQUESTS: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.TOO_MANY_REQUESTS.message, {
      extensions: {
        code: SystemErrorMap.TOO_MANY_REQUESTS.code,
        http: { status: SystemErrorMap.TOO_MANY_REQUESTS.httpStatus },
      },
    }),
};
