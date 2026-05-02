import { GraphQLError } from "graphql";

export const MembershipErrorMap = {
  MEMBERSHIP_NOT_FOUND: {
    code: "MEMBERSHIP_NOT_FOUND",
    message: "Гишүүнчлэл олдсонгүй",
  },
  DUPLICATE_MEMBERSHIP: {
    code: "DUPLICATE_MEMBERSHIP",
    message: "Гишүүнчлэл бүртгэгдсэн байна",
  },
  LAST_OWNER: {
    code: "LAST_OWNER",
    message: "Сүүлчийн OWNER-г өөрчлөх/устгах боломжгүй",
  },
};

export const MembershipErrors = {
  MEMBERSHIP_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(MembershipErrorMap.MEMBERSHIP_NOT_FOUND.message, {
      extensions: MembershipErrorMap.MEMBERSHIP_NOT_FOUND,
    }),
  DUPLICATE_MEMBERSHIP: (): GraphQLError =>
    new GraphQLError(MembershipErrorMap.DUPLICATE_MEMBERSHIP.message, {
      extensions: MembershipErrorMap.DUPLICATE_MEMBERSHIP,
    }),
  LAST_OWNER: (): GraphQLError =>
    new GraphQLError(MembershipErrorMap.LAST_OWNER.message, {
      extensions: MembershipErrorMap.LAST_OWNER,
    }),
};
