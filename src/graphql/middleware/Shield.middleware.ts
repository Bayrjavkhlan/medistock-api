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
    if (ctx.reqUser?.user?.isPlatformAdmin) {
      return true;
    }
    try {
      accessibleBy(ctx.caslAbility, action, modelName);
      return true;
    } catch (error) {
      const userId = ctx.reqUser?.user?.id ?? "anonymous";
      const orgId = ctx.activeOrg?.organization?.id ?? "none";
      console.warn(
        "[RBAC] Denied",
        JSON.stringify({ action, modelName, userId, orgId })
      );
      void error;
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
    me: and(isAuthenticated, rl.generous),
    dashboardOverview: and(isAuthenticated, rl.normal),
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
    adminMapLocations: and(isAuthenticated, rl.normal),
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
    pharmacyDetail: and(
      isAuthenticated,
      accessRequired("read", "Pharmacy"),
      rl.normal
    ),
    pharmacies: and(
      isAuthenticated,
      accessRequired("read", "Pharmacy"),
      rl.normal
    ),
    pharmacyOption: and(
      isAuthenticated,
      accessRequired("read", "Pharmacy"),
      rl.generous
    ),
    drugDetail: and(isAuthenticated, accessRequired("read", "Drug"), rl.normal),
    drugs: and(isAuthenticated, accessRequired("read", "Drug"), rl.normal),
    pharmacyDrugs: and(
      isAuthenticated,
      accessRequired("read", "PharmacyDrug"),
      rl.normal
    ),
    userDetail: and(isAuthenticated, accessRequired("read", "User"), rl.normal),
    users: and(isAuthenticated, accessRequired("read", "User"), rl.normal),
    bookingDetail: and(
      isAuthenticated,
      accessRequired("read", "Booking"),
      rl.normal
    ),
    bookings: and(
      isAuthenticated,
      accessRequired("read", "Booking"),
      rl.normal
    ),
    memberships: and(
      isAuthenticated,
      accessRequired("read", "Membership"),
      rl.normal
    ),
  },
  Mutation: {
    login: and(allow, rl.login),
    refreshAccessToken: and(allow, rl.login),
    selectOrganization: and(isAuthenticated, rl.normal),
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
    hospitalDelete: and(
      isAuthenticated,
      accessRequired("delete", "Hospital"),
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
    equipmentDelete: and(
      isAuthenticated,
      accessRequired("delete", "Equipment"),
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
    equipmentLogDelete: and(
      isAuthenticated,
      accessRequired("delete", "EquipmentLog"),
      rl.normal
    ),
    pharmacyCreate: and(
      isAuthenticated,
      accessRequired("create", "Pharmacy"),
      rl.strict
    ),
    pharmacyUpdate: and(
      isAuthenticated,
      accessRequired("update", "Pharmacy"),
      rl.strict
    ),
    pharmacyDelete: and(
      isAuthenticated,
      accessRequired("delete", "Pharmacy"),
      rl.strict
    ),
    drugCreate: and(
      isAuthenticated,
      accessRequired("create", "Drug"),
      rl.strict
    ),
    drugUpdate: and(
      isAuthenticated,
      accessRequired("update", "Drug"),
      rl.strict
    ),
    drugDelete: and(
      isAuthenticated,
      accessRequired("delete", "Drug"),
      rl.strict
    ),
    pharmacyDrugUpsert: and(
      isAuthenticated,
      accessRequired("create", "PharmacyDrug"),
      rl.strict
    ),
    pharmacyDrugDelete: and(
      isAuthenticated,
      accessRequired("delete", "PharmacyDrug"),
      rl.strict
    ),
    userCreate: and(
      isAuthenticated,
      accessRequired("create", "User"),
      rl.strict
    ),
    userUpdate: and(
      isAuthenticated,
      accessRequired("update", "User"),
      rl.strict
    ),
    userDelete: and(
      isAuthenticated,
      accessRequired("delete", "User"),
      rl.strict
    ),
    bookingCreate: and(
      isAuthenticated,
      accessRequired("create", "Booking"),
      rl.strict
    ),
    bookingUpdate: and(
      isAuthenticated,
      accessRequired("update", "Booking"),
      rl.strict
    ),
    bookingDelete: and(
      isAuthenticated,
      accessRequired("delete", "Booking"),
      rl.strict
    ),
    membershipCreate: and(
      isAuthenticated,
      accessRequired("create", "Membership"),
      rl.strict
    ),
    membershipUpdate: and(
      isAuthenticated,
      accessRequired("update", "Membership"),
      rl.strict
    ),
    membershipDelete: and(
      isAuthenticated,
      accessRequired("delete", "Membership"),
      rl.strict
    ),
  },
};

const shieldMiddleware = shield(permissions, {
  debug: true,
  fallbackError: Errors.System.PERMISSION_DENIED(),
});

export { permissions, shieldMiddleware };
