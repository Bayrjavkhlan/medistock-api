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
  console.error("GraphQL Error:", originalError);

  const message =
    originalError.message ||
    formattedError.message ||
    "Тодорхойгүй алдаа гарлаа. Администраторт хандана уу.";

  let code =
    formattedError.extensions?.code ||
    originalError.code ||
    "INTERNAL_SERVER_ERROR";

  if (originalError instanceof ForbiddenError) {
    code = "FORBIDDEN";
    return {
      message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
      extensions: { code },
    };
  }

  switch (code) {
    case "PERMISSION_DENIED":
    case "UNAUTHORIZED":
    case "FORBIDDEN":
      return {
        message: "Таньд энэ үйлдлийг хийх эрх байхгүй байна.",
        extensions: { code },
      };
    case "UNAUTHENTICATED":
      return {
        message: "Та нэвтрээгүй байна. Нэвтрэх шаардлагатай.",
        extensions: { code },
      };
    case ApolloServerErrorCode.BAD_USER_INPUT:
      return {
        message,
        extensions: {
          code,
          details: originalError.details,
        },
      };
    default:
      return {
        message,
        extensions: { code },
      };
  }
};
