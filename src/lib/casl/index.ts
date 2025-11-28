import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import {
  EnumStaffRole,
  Equipment,
  EquipmentLog,
  Hospital,
  Staff,
} from "@prisma/client";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";

export type ModelName = "Staff" | "Equipment" | "EquipmentLog" | "Hospital";

export type Action = "all" | "create" | "read" | "update" | "delete";

export type AppSubjects = Subjects<{
  Staff: Staff;
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
}>;

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

export const accessibleBy = (
  ability: AppAbility,
  action: Action,
  modelName: ModelName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  if (!ability.can(action, modelName)) {
    throw Errors.System.PERMISSION_DENIED();
  }

  const rules = ability.rulesFor(action, modelName);

  return rules.reduce((acc, rule) => {
    if (rule.conditions && typeof rule.conditions === "object") {
      return { ...acc, ...rule.conditions };
    }
    return acc;
  }, {});
};

export const createAbilities = (ctx: Pick<Context, "reqStaff">): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  const staff = ctx.reqStaff;
  const role = staff?.staff?.roles[0]?.key;
  const hospitalId = staff?.hospital?.id;

  switch (role) {
    case "ADMIN":
      can(
        ["create", "read", "update", "delete"],
        ["Staff", "Equipment", "EquipmentLog", "Hospital"]
      );
      break;

    case "HOSPITAL_ADMIN":
      if (!hospitalId)
        throw Errors.Hospital.HOSPITAL_ADMIN_NO_ASSOCIATED_HOSPITAL();

      can("create", "Staff", {
        hospitalId,
        roles: { some: { key: EnumStaffRole.STAFF } },
      });
      can(["read", "update", "delete"], "Staff", { hospitalId });

      can(["create", "read", "update", "delete"], "Equipment", { hospitalId });

      can(["create", "read", "update", "delete"], "EquipmentLog", {
        equipment: { hospitalId },
      });
      can(["read", "update"], "Hospital", { id: hospitalId });
      break;

    case "STAFF":
      if (hospitalId) {
        can("read", "Equipment", { hospitalId });

        if (staff.staff?.id) {
          can("update", "Equipment", { staffId: staff.staff.id });
          can(["create", "read", "update"], "EquipmentLog", {
            staffId: staff.staff.id,
          });
        }
      }

      cannot("delete", ["Staff", "Equipment", "EquipmentLog"]);
      break;

    default:
    case undefined:
      cannot("all", ["Staff", "Equipment", "EquipmentLog", "Hospital"]);
      break;
  }

  return build();
};
