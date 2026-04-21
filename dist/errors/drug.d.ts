import { GraphQLError } from "graphql";
export declare const DrugErrorMap: {
    DRUG_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_DRUG: {
        code: string;
        message: string;
    };
};
export declare const DrugErrors: {
    DRUG_NOT_FOUND: () => GraphQLError;
    DUPLICATE_DRUG: () => GraphQLError;
};
//# sourceMappingURL=drug.d.ts.map