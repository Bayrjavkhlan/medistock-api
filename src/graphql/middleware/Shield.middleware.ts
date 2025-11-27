/* eslint-disable @typescript-eslint/no-explicit-any */
import { allow, and, rule, shield } from "graphql-shield";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";
import { NexusGenFieldTypes } from "@/graphql/generated/nexus-typegen";
import { accessibleBy, type Action, ModelName } from "@/lib/casl";

import { rateLimit } from "./RateLimiter.middleware";

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

const rl = {
  test: rateLimit(5, 10),
  login: rateLimit(10, 100),
  strict: rateLimit(30, 1000),
  heavy: rateLimit(30, 2000),
  normal: rateLimit(100, 10_000),
  generous: rateLimit(300, 50_000),
};

const permissions: Permissions = {
  Query: {
    currentUser: and(isAuthenticated, rl.generous),
    userDetail: and(isAuthenticated, accessRequired("read", "User"), rl.normal),
    users: and(isAuthenticated, accessRequired("read", "User"), rl.normal),
    hospitalDetail: and(
      isAuthenticated,
      accessRequired("read", "Hospital"),
      rl.normal
    ),
    hospitals: and(
      isAuthenticated,
      accessRequired("read", "Hospital"),
      rl.normal
    ),
    hospitalOption: and(
      isAuthenticated,
      accessRequired("read", "Hospital"),
      rl.generous
    ),
    equipmentDetail: and(
      isAuthenticated,
      accessRequired("read", "Equipment"),
      rl.normal
    ),
    equipments: and(
      isAuthenticated,
      accessRequired("read", "Equipment"),
      rl.normal
    ),
    equipmentLogDetail: and(
      isAuthenticated,
      accessRequired("read", "EquipmentLog"),
      rl.normal
    ),
    equipmentLogs: and(
      isAuthenticated,
      accessRequired("read", "EquipmentLog"),
      rl.normal
    ),
  },
  Mutation: {
    login: and(allow, rl.login),
    refreshAccessToken: and,
    userCreate: and(
      isAuthenticated,
      accessRequired("create", "User"),
      rl.strict
    ),
    userUpdate: and(
      isAuthenticated,
      accessRequired("update", "User"),
      rl.normal
    ),
    hospitalCreate: and(
      isAuthenticated,
      accessRequired("create", "Hospital"),
      rl.strict
    ),
    hospitalUpdate: and(
      isAuthenticated,
      accessRequired("update", "Hospital"),
      rl.strict
    ),
    equipmentCreate: and(
      isAuthenticated,
      accessRequired("create", "Equipment"),
      rl.normal
    ),
    equipmentUpdate: and(
      isAuthenticated,
      accessRequired("update", "Equipment"),
      rl.normal
    ),
    equipmentLogCreate: and(
      isAuthenticated,
      accessRequired("create", "EquipmentLog"),
      rl.normal
    ),
    equipmentLogUpdate: and(
      isAuthenticated,
      accessRequired("update", "EquipmentLog"),
      rl.normal
    ),
  },
};

const shieldMiddleware = shield(permissions, {
  debug: true,
  fallbackError: Errors.System.PERMISSION_DENIED(),
});

export { permissions, shieldMiddleware };
