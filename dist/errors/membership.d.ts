import { GraphQLError } from "graphql";
export declare const MembershipErrorMap: {
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
};
export declare const MembershipErrors: {
    MEMBERSHIP_NOT_FOUND: () => GraphQLError;
    DUPLICATE_MEMBERSHIP: () => GraphQLError;
    LAST_OWNER: () => GraphQLError;
};
//# sourceMappingURL=membership.d.ts.map