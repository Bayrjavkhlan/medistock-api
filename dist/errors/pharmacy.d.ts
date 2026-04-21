import { GraphQLError } from "graphql";
export declare const PharmacyErrorMap: {
    PHARMACY_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_PHARMACY: {
        code: string;
        message: string;
    };
};
export declare const PharmacyErrors: {
    PHARMACY_NOT_FOUND: () => GraphQLError;
    DUPLICATE_PHARMACY: () => GraphQLError;
};
//# sourceMappingURL=pharmacy.d.ts.map