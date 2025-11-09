import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import {
  EnumUserRole,
  Equipment,
  EquipmentLog,
  Hospital,
  User,
} from "@prisma/client";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";

export type ModelName = "User" | "Equipment" | "EquipmentLog" | "Hospital";

export const accessibleBy = (
  ability: AppAbility,
  action: Action,
  modelName: ModelName
): void => {
  if (!ability.can(action, modelName)) {
    throw new Error(`Та ${action} үйлдэл ${modelName} дээр хийх эрхгүй байна`);
  }
};
export type Action = "all" | "create" | "read" | "update" | "delete";

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
  const role = user?.user?.roles[0]?.key;
  const hospitalId = user?.hospital?.id;

  switch (role) {
    case "ADMIN":
      can(
        ["create", "read", "update", "delete"],
        ["User", "Equipment", "EquipmentLog", "Hospital"]
      );
      break;

    case "HOSPITAL_ADMIN":
      if (!hospitalId)
        throw Errors.Hospital.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL();

      can("create", "User", {
        hospitalId,
        roles: { some: { key: EnumUserRole.STAFF } },
      });
      can(["read", "update", "delete"], "User", { hospitalId });

      can(["create", "read", "update", "delete"], "Equipment", { hospitalId });

      can(["create", "read", "update", "delete"], "EquipmentLog", {
        equipment: { hospitalId },
      });
      break;

    case "STAFF":
      if (hospitalId) {
        can("read", "Equipment", { hospitalId });

        if (user.user?.id) {
          can("update", "Equipment", { userId: user.user.id });
          can(["create", "read", "update"], "EquipmentLog", {
            userId: user.user.id,
          });
        }
      }

      cannot("delete", ["User", "Equipment", "EquipmentLog"]);
      break;

    default:
    case undefined:
      cannot("all", ["User", "Equipment", "EquipmentLog", "Hospital"]);
      break;
  }

  return build();
};
