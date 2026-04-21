"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLogErrors = exports.EquipmentLogErrorMap = void 0;
const graphql_1 = require("graphql");
exports.EquipmentLogErrorMap = {
    EQUIPMENT_LOG_NOT_FOUND: {
        code: "EQUIPMENT_LOG_NOT_FOUND",
        message: "Төхөөрөмжийн тэмдэглэл олдсонгүй",
    },
};
exports.EquipmentLogErrors = {
    EQUIPMENT_NOT_FOUND: () => new graphql_1.GraphQLError(exports.EquipmentLogErrorMap.EQUIPMENT_LOG_NOT_FOUND.message, {
        extensions: exports.EquipmentLogErrorMap.EQUIPMENT_LOG_NOT_FOUND,
    }),
};
//# sourceMappingURL=equipmentLog.js.map