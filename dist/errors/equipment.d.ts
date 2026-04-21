import { GraphQLError } from "graphql";
export declare const EquipmentErrorMap: {
    EQUIPMENT_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_EQUIPMENT_SERIAL_NUMBER: {
        code: string;
        message: string;
    };
};
export declare const EquipmentErrors: {
    EQUIPMENT_NOT_FOUND: () => GraphQLError;
    DUPLICATE_EQUIPMENT_SERIAL_NUMBER: () => GraphQLError;
};
//# sourceMappingURL=equipment.d.ts.map