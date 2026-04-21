export * from "../errors/formatter";
export declare const ErrorMap: {
    MEMBERSHIP_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_MEMBERSHIP: {
        code: string;
        message: string;
    };
    LAST_OWNER: {
        code: string;
        message: string;
    };
    BOOKING_NOT_FOUND: {
        code: string;
        message: string;
    };
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
    EQUIPMENT_LOG_NOT_FOUND: {
        code: string;
        message: string;
    };
    EQUIPMENT_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_EQUIPMENT_SERIAL_NUMBER: {
        code: string;
        message: string;
    };
    DRUG_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_DRUG: {
        code: string;
        message: string;
    };
    PHARMACY_NOT_FOUND: {
        code: string;
        message: string;
    };
    DUPLICATE_PHARMACY: {
        code: string;
        message: string;
    };
    HOSPITAL_NOT_FOUND: {
        code: string;
        message: string;
    };
    HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: {
        code: string;
        message: string;
    };
    DUPLICATE_HOSPITAL: {
        code: string;
        message: string;
    };
    MEMBER_NOT_IN_ORGANIZATION: {
        code: string;
        message: string;
    };
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
export declare const Errors: {
    Auth: {
        NOT_AUTHORIZED: () => import("graphql").GraphQLError;
        INVALID_ACCESS_TOKEN: () => import("graphql").GraphQLError;
        ACCESS_TOKEN_EXPIRED: () => import("graphql").GraphQLError;
        REFRESH_TOKEN_EXPIRED: () => import("graphql").GraphQLError;
        INVALID_REFRESH_TOKEN: () => import("graphql").GraphQLError;
        WRONG_USERNAME_PASSWORD: () => import("graphql").GraphQLError;
        EMAIL_NOT_VERIFIED: () => import("graphql").GraphQLError;
        INVALID_OTP: () => import("graphql").GraphQLError;
        OTP_EXPIRED: () => import("graphql").GraphQLError;
        OTP_RESEND_TOO_SOON: () => import("graphql").GraphQLError;
        TOO_MANY_OTP_ATTEMPTS: () => import("graphql").GraphQLError;
    };
    System: {
        INTERNAL_SERVER_ERROR: () => import("graphql").GraphQLError;
        DATA_NOT_FOUND: () => import("graphql").GraphQLError;
        PERMISSION_DENIED: () => import("graphql").GraphQLError;
        ACCESS_DENIED: () => import("graphql").GraphQLError;
        TOO_MANY_REQUESTS: () => import("graphql").GraphQLError;
    };
    Hospital: {
        HOSPITAL_NOT_FOUND: () => import("graphql").GraphQLError;
        HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: () => import("graphql").GraphQLError;
        DUPLICATE_HOSPITAL: () => import("graphql").GraphQLError;
        MEMBER_NOT_IN_ORGANIZATION: () => import("graphql").GraphQLError;
    };
    Pharmacy: {
        PHARMACY_NOT_FOUND: () => import("graphql").GraphQLError;
        DUPLICATE_PHARMACY: () => import("graphql").GraphQLError;
    };
    Drug: {
        DRUG_NOT_FOUND: () => import("graphql").GraphQLError;
        DUPLICATE_DRUG: () => import("graphql").GraphQLError;
    };
    Equipment: {
        EQUIPMENT_NOT_FOUND: () => import("graphql").GraphQLError;
        DUPLICATE_EQUIPMENT_SERIAL_NUMBER: () => import("graphql").GraphQLError;
    };
    EquipmentLog: {
        EQUIPMENT_NOT_FOUND: () => import("graphql").GraphQLError;
    };
    User: {
        USER_NOT_FOUND: () => import("graphql").GraphQLError;
        DUPLICATE_USER: () => import("graphql").GraphQLError;
        USER_IN_USE: () => import("graphql").GraphQLError;
        ROLE_REQUIRED: () => import("graphql").GraphQLError;
        NAME_REQUIRED: () => import("graphql").GraphQLError;
        INVALID_EMAIL: () => import("graphql").GraphQLError;
        WEAK_PASSWORD: () => import("graphql").GraphQLError;
        EMAIL_ALREADY_EXISTS: () => import("graphql").GraphQLError;
        EMAIL_ALREADY_VERIFIED: () => import("graphql").GraphQLError;
    };
    Booking: {
        BOOKING_NOT_FOUND: () => import("graphql").GraphQLError;
    };
    Membership: {
        MEMBERSHIP_NOT_FOUND: () => import("graphql").GraphQLError;
        DUPLICATE_MEMBERSHIP: () => import("graphql").GraphQLError;
        LAST_OWNER: () => import("graphql").GraphQLError;
    };
};
//# sourceMappingURL=index.d.ts.map