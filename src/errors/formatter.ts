import {
  ApolloServerErrorCode,
  unwrapResolverError,
} from "@apollo/server/errors";
import { ForbiddenError } from "@casl/ability";
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

  const baseMessage =
    originalError.message ||
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

  if (originalError instanceof ForbiddenError) {
    return {
      ...baseError,
      extensions: {
        ...extensions,
        code: "FORBIDDEN",
        message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
      },
    };
  }

  switch (extensions.code) {
    case ApolloServerErrorCode.BAD_USER_INPUT:
      return {
        ...baseError,
        message: baseMessage,
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
          message: "Алдаатай query байна.",
        },
      };
    case "UNAUTHENTICATED":
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: "Энэ үйлдлийг хийхийн тулд нэвтрэх шаардлагатай байна.",
        },
      };
    case "FORBIDDEN":
      return {
        ...baseError,
        extensions: {
          ...extensions,
          message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
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
