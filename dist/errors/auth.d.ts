import { GraphQLError } from "graphql";
import { CustomError } from "../errors/types";
export declare const AuthErrorMap: CustomError;
export declare const AuthErrors: {
    NOT_AUTHORIZED: () => GraphQLError;
    INVALID_ACCESS_TOKEN: () => GraphQLError;
    ACCESS_TOKEN_EXPIRED: () => GraphQLError;
    REFRESH_TOKEN_EXPIRED: () => GraphQLError;
    INVALID_REFRESH_TOKEN: () => GraphQLError;
    WRONG_USERNAME_PASSWORD: () => GraphQLError;
    EMAIL_NOT_VERIFIED: () => GraphQLError;
    INVALID_OTP: () => GraphQLError;
    OTP_EXPIRED: () => GraphQLError;
    OTP_RESEND_TOO_SOON: () => GraphQLError;
    TOO_MANY_OTP_ATTEMPTS: () => GraphQLError;
};
//# sourceMappingURL=auth.d.ts.map