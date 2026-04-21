"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentErrors = exports.EquipmentErrorMap = void 0;
const graphql_1 = require("graphql");
exports.EquipmentErrorMap = {
    EQUIPMENT_NOT_FOUND: {
        code: "EQUIPMENT_NOT_FOUND",
        message: "Төхөөрөмж олдсонгүй",
    },
    DUPLICATE_EQUIPMENT_SERIAL_NUMBER: {
        code: "DUPLICATE_EQUIPMENT_SERIAL_NUMBER",
        message: "Бүртгэлтэй сериал дугаар давхцаж байна",
    },
};
exports.EquipmentErrors = {
    EQUIPMENT_NOT_FOUND: () => new graphql_1.GraphQLError(exports.EquipmentErrorMap.EQUIPMENT_NOT_FOUND.message, {
        extensions: exports.EquipmentErrorMap.EQUIPMENT_NOT_FOUND,
    }),
    DUPLICATE_EQUIPMENT_SERIAL_NUMBER: () => new graphql_1.GraphQLError(exports.EquipmentErrorMap.DUPLICATE_EQUIPMENT_SERIAL_NUMBER.message, {
        extensions: exports.EquipmentErrorMap.DUPLICATE_EQUIPMENT_SERIAL_NUMBER,
    }),
};
//# sourceMappingURL=equipment.js.map