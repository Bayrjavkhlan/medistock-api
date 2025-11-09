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
    message: "Хандах эрхгүй",
  },
  ACCESS_DENIED: {
    code: "ACCESS_DENIED",
    message: "Хандах эрхгүй",
  },
};

export const SystemErrors = {
  INTERNAL_SERVER_ERROR: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.INTERNAL_SERVER_ERROR.message, {
      extensions: SystemErrorMap.INTERNAL_SERVER_ERROR,
    }),
  DATA_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.DATA_NOT_FOUND.message, {
      extensions: SystemErrorMap.DATA_NOT_FOUND,
    }),
  PERMISSION_DENIED: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.PERMISSION_DENIED.message, {
      extensions: SystemErrorMap.PERMISSION_DENIED,
    }),
  ACCESS_DENIED: (): GraphQLError =>
    new GraphQLError(SystemErrorMap.ACCESS_DENIED.message, {
      extensions: SystemErrorMap.ACCESS_DENIED,
    }),
};
