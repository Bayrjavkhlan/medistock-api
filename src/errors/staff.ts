import { GraphQLError } from "graphql";

import { CustomError } from "@/errors/types";

export const StaffErrorMap: CustomError = {
  DATA_NOT_FOUND: {
    code: "DATA_NOT_FOUND",
    message: "Дата олдсонгүй",
  },
  CAN_NOT_STAFF_CREATE: {
    code: "CAN_NOT_STAFF_CREATE",
    message: "Хэрэглэгч үүсгэх боломжгүй байна",
  },
  DUPLICATED_STAFF_EMAIL: {
    code: "DUPLICATED_STAFF_EMAIL",
    message: "Бүртгэлтэй хэрэглэгч байна",
  },
  STAFF_NOT_FOUND: {
    code: "STAFF_NOT_FOUND",
    message: "Хэрэглэгч олдсонгүй",
  },
};

export const StaffErrors = {
  DATA_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(StaffErrorMap.DATA_NOT_FOUND!.message, {
      extensions: StaffErrorMap.DATA_NOT_FOUND,
    }),
  CAN_NOT_STAFF_CREATE: (): GraphQLError =>
    new GraphQLError(StaffErrorMap.CAN_NOT_STAFF_CREATE!.message, {
      extensions: StaffErrorMap.CAN_NOT_STAFF_CREATE,
    }),
  DUPLICATED_STAFF_EMAIL: (): GraphQLError =>
    new GraphQLError(StaffErrorMap.DUPLICATED_STAFF_EMAIL!.message, {
      extensions: StaffErrorMap.DUPLICATED_STAFF_EMAIL,
    }),
  STAFF_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(StaffErrorMap.STAFF_NOT_FOUND!.message, {
      extensions: StaffErrorMap.STAFF_NOT_FOUND,
    }),
};
