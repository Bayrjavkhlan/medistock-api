/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError, GraphQLResolveInfo } from "graphql";

import { env } from "@/config";
import { Errors } from "@/errors";
import { Context } from "@/graphql/context";

type ResolverMiddleware = (
  resolve: any,
  parent: any,
  args: any,
  ctx: Context,
  info: GraphQLResolveInfo
) => Promise<any>;

export const errorMiddleware: ResolverMiddleware = async (
  resolve,
  parent,
  args,
  ctx,
  info
) => {
  const startTime = performance.now();
  const operation = info.fieldName;
  const parentType = info.parentType.name;

  try {
    const result = await resolve(parent, args, ctx, info);
    return result;
  } catch (error) {
    // TODO send alert notification
    if (error instanceof GraphQLError) {
      if (error.extensions.code === "INTERNAL_SERVER_ERROR") {
        console.log("Report error: ", error);
      }
      throw error;
    }

    const endTime = performance.now();

    const logData = {
      operation,
      parentType,
      args: JSON.stringify(args),
      executionTime: `${(endTime - startTime).toFixed(2)}ms`,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    if (env.NODE_ENV !== "local") {
      console.log("Report error: ", logData);
    }

    throw Errors.System.INTERNAL_SERVER_ERROR();
  }
};
