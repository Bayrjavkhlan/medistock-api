import { GraphQLError } from "graphql";

export const EquipmentLogErrorMap = {
  EQUIPMENT_LOG_NOT_FOUND: {
    code: "EQUIPMENT_LOG_NOT_FOUND",
    message: "Төхөөрөмжийн тэмдэглэл олдсонгүй",
  },
};

export const EquipmentLogErrors = {
  EQUIPMENT_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(EquipmentLogErrorMap.EQUIPMENT_LOG_NOT_FOUND.message, {
      extensions: EquipmentLogErrorMap.EQUIPMENT_LOG_NOT_FOUND,
    }),
};
