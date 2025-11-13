import { GraphQLError } from "graphql";

export const EquipmentErrorMap = {
  EQUIPMENT_NOT_FOUND: {
    code: "EQUIPMENT_NOT_FOUND",
    message: "Төхөөрөмж олдсонгүй",
  },
  DUPLICATE_EQUIPMENT_SERIAL_NUMBER: {
    code: "DUPLICATE_EQUIPMENT_SERIAL_NUMBER",
    message: "Бүртгэлтэй сериал дугаар давхцаж байна",
  },
};

export const EquipmentErrors = {
  EQUIPMENT_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(EquipmentErrorMap.EQUIPMENT_NOT_FOUND.message, {
      extensions: EquipmentErrorMap.EQUIPMENT_NOT_FOUND,
    }),
  DUPLICATE_EQUIPMENT_SERIAL_NUMBER: (): GraphQLError =>
    new GraphQLError(
      EquipmentErrorMap.DUPLICATE_EQUIPMENT_SERIAL_NUMBER.message,
      {
        extensions: EquipmentErrorMap.DUPLICATE_EQUIPMENT_SERIAL_NUMBER,
      }
    ),
};
