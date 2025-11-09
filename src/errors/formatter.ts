import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from "@apollo/server/errors";
import { GraphQLFormattedError } from "graphql";

type CustomError = {
  code?: string;
  details?: unknown;
} & Error;

export const formatError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError => {
  const originalError = unwrapResolverError(error) as CustomError;

  console.error("Error:", originalError);

  // Use originalError.message if available, fallback to formattedError.message, then generic
  const baseMessage =
    originalError?.message ||
    formattedError.message ||
    "Тодорхойгүй алдаа гарлаа. Администраторт хандана уу.";

  const baseError = {
    message: baseMessage,
    path: formattedError.path,
  };

  const exception: Record<string, unknown> =
    typeof originalError === "object" ? { ...originalError } : {};

  delete exception.extensions;
  delete exception.stacktrace;

  const extensions: Record<string, unknown> = {
    code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR",
    exception,
  };

  // Custom handling for certain codes
  switch (extensions.code) {
    case ApolloServerErrorCode.BAD_USER_INPUT:
      return {
        ...baseError,
        message: baseMessage, // original message preserved
        extensions: {
          ...extensions,
          message: baseMessage,
          details:
            originalError.details ||
            "Оруулсан мэдээллээ шалгаад дахин оролдоно уу.",
        },
      };
    case ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND:
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: baseMessage,
        },
      };
    case "UNAUTHENTICATED":
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: baseMessage,
        },
      };
    case "FORBIDDEN":
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: baseMessage,
        },
      };
    default:
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: baseMessage,
        },
      };
  }
};
