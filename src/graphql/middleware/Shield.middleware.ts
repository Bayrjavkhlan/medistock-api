/* eslint-disable @typescript-eslint/no-explicit-any */
import { allow, and, rule, shield } from "graphql-shield";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";
import { NexusGenFieldTypes } from "@/graphql/generated/nexus-typegen";
import { accessibleBy, type Action, ModelName } from "@/lib/casl";

type Permissions = {
  [K in "Query" | "Mutation"]?: {
    [P in keyof NexusGenFieldTypes[K]]?: any;
  };
};

const isAuthenticated = rule({ cache: "contextual" })(async (
  _parent: any,
  _arg: any,
  ctx: Context
) => {
  const isAuthenticated = Boolean(ctx.reqUser?.user?.id);
  if (!isAuthenticated) throw Errors.Auth.NOT_AUTHORIZED();
  return isAuthenticated;
});

const accessRequired = (action: Action, modelName: ModelName) =>
  rule({ cache: "contextual" })(async (_parent, _args, ctx: Context) => {
    try {
      accessibleBy(ctx.caslAbility, action, modelName);
      return true;
    } catch {
      return false;
    }
  });

const permissions: Permissions = {
  Query: {
    currentUser: isAuthenticated,
    userDetail: and(isAuthenticated, accessRequired("read", "User")),
    users: and(isAuthenticated, accessRequired("read", "User")),
  },
  Mutation: {
    login: allow,
    refreshAccessToken: allow,
    userCreate: and(isAuthenticated, accessRequired("create", "User")),
    userUpdate: and(isAuthenticated, accessRequired("update", "User")),
  },
};

const shieldMiddleware = shield(permissions, {
  debug: true,
  fallbackError: Errors.System.PERMISSION_DENIED(),
});

export { permissions, shieldMiddleware };
