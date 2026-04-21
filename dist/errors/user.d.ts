import { GraphQLError } from "graphql";
export declare const UserErrorMap: {
    USER_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_USER: {
        code: string;
        message: string;
    };
    USER_IN_USE: {
        code: string;
        message: string;
    };
    ROLE_REQUIRED: {
        code: string;
        message: string;
    };
    NAME_REQUIRED: {
        code: string;
        message: string;
    };
    INVALID_EMAIL: {
        code: string;
        message: string;
    };
    WEAK_PASSWORD: {
        code: string;
        message: string;
    };
    EMAIL_ALREADY_EXISTS: {
        code: string;
        message: string;
    };
    EMAIL_ALREADY_VERIFIED: {
        code: string;
        message: string;
    };
};
export declare const UserErrors: {
    USER_NOT_FOUND: () => GraphQLError;
    DUPLICATE_USER: () => GraphQLError;
    USER_IN_USE: () => GraphQLError;
    ROLE_REQUIRED: () => GraphQLError;
    NAME_REQUIRED: () => GraphQLError;
    INVALID_EMAIL: () => GraphQLError;
    WEAK_PASSWORD: () => GraphQLError;
    EMAIL_ALREADY_EXISTS: () => GraphQLError;
    EMAIL_ALREADY_VERIFIED: () => GraphQLError;
};
//# sourceMappingURL=user.d.ts.map