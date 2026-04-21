import { GraphQLError } from "graphql";
export declare const SystemErrorMap: {
    INTERNAL_SERVER_ERROR: {
        code: string;
        message: string;
    };
    DATA_NOT_FOUND: {
        code: string;
        message: string;
    };
    PERMISSION_DENIED: {
        code: string;
        message: string;
    };
    ACCESS_DENIED: {
        code: string;
        message: string;
    };
    TOO_MANY_REQUESTS: {
        code: string;
        message: string;
        httpStatus: number;
    };
};
export declare const SystemErrors: {
    INTERNAL_SERVER_ERROR: () => GraphQLError;
    DATA_NOT_FOUND: () => GraphQLError;
    PERMISSION_DENIED: () => GraphQLError;
    ACCESS_DENIED: () => GraphQLError;
    TOO_MANY_REQUESTS: () => GraphQLError;
};
//# sourceMappingURL=system.d.ts.map