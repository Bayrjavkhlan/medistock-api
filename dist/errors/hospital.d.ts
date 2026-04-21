import { GraphQLError } from "graphql";
export declare const HospitalErrorMap: {
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
};
export declare const HospitalErrors: {
    HOSPITAL_NOT_FOUND: () => GraphQLError;
    HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL: () => GraphQLError;
    DUPLICATE_HOSPITAL: () => GraphQLError;
    MEMBER_NOT_IN_ORGANIZATION: () => GraphQLError;
};
//# sourceMappingURL=hospital.d.ts.map