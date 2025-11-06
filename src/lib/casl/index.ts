/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbilityBuilder, PureAbility } from "@casl/ability";
import {
  accessibleBy,
  createPrismaAbility,
  PrismaQuery,
  Subjects,
} from "@casl/prisma";
import { Equipment, EquipmentLog, Hospital, User } from "@prisma/client";

import { Context } from "@/graphql/context";

export type Action = "all" | "create" | "read" | "update" | "delete";

export type ModelName = "User" | "Equipment" | "EquipmentLog" | "Hospital";

export type AppSubjects = Subjects<{
  User: User;
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
}>;

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

export const createAbilities = (ctx: Pick<Context, "reqUser">): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  const user = ctx.reqUser;

  switch (user.rolekey) {
    case "ADMIN":
      can("all", ["User", "Equipment", "EquipmentLog", "Hospital"]);
      break;

    case "HOSPITAL_ADMIN":
      can(["create", "read", "update", "delete"], "User", {
        hospitalId: user.hospital.id,
      });
      can(["create", "read", "update", "delete"], "Equipment", {
        hospitalId: user.hospital.id,
      });
      can(["create", "read", "update", "delete"], "EquipmentLog", {
        equipment: {
          hospitalId: user.hospital.id,
        },
      });
      break;

    case "STAFF":
      can("read", "Equipment", { hospitalId: user.hospital.id });
      can("update", "EquipmentLog", { userId: user.user.id });
      break;

    default:
      cannot("all", ["User", "Equipment", "EquipmentLog", "Hospital"]);
      break;
  }

  return build();
};

export const getPrismaWhere = <T>(
  ability: AppAbility,
  action: Action,
  model: ModelName
): T => {
  const conditions = accessibleBy(ability, action)[model] as
    | Record<string, any>
    | undefined;

  const safeConditions = conditions || {};

  if (Array.isArray((safeConditions as any).OR)) {
    return { OR: (safeConditions as any).OR } as T;
  }

  const { OR: _omit, ...rest } = safeConditions;
  return rest as T;
};
