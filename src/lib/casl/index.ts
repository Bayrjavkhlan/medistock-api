import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import {
  Booking,
  Equipment,
  EquipmentLog,
  Hospital,
  Pharmacy,
  PharmacyDrug,
} from "@prisma/client";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";

export type Action = "all" | "create" | "read" | "update" | "delete";

type PrismaSubjects = Subjects<{
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
  Pharmacy: Pharmacy;
  PharmacyDrug: PharmacyDrug;
  Booking: Booking;
}>;

type SubjectMap = {
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
  Pharmacy: Pharmacy;
  PharmacyDrug: PharmacyDrug;
  Booking: Booking;
};

export type ModelName = keyof SubjectMap;

export type AppAbility = PureAbility<[Action, PrismaSubjects], PrismaQuery>;

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

export const createAbilities = (
  ctx: Pick<Context, "reqUser" | "activeOrg">
): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  const user = ctx.reqUser?.user;
  const org = ctx.activeOrg;

  if (user?.isPlatformAdmin) {
    can(["create", "read", "update", "delete"], "Equipment");
    can(["create", "read", "update", "delete"], "EquipmentLog");
    can(["create", "read", "update", "delete"], "Hospital");
    can(["create", "read", "update", "delete"], "Pharmacy");
    can(["create", "read", "update", "delete"], "PharmacyDrug");
    can(["create", "read", "update", "delete"], "Booking");
    return build();
  }

  if (!org) {
    cannot(["create", "read", "update", "delete"], "Equipment");
    cannot(["create", "read", "update", "delete"], "EquipmentLog");
    cannot(["create", "read", "update", "delete"], "Hospital");
    cannot(["create", "read", "update", "delete"], "Pharmacy");
    cannot(["create", "read", "update", "delete"], "PharmacyDrug");
    cannot(["create", "read", "update", "delete"], "Booking");
    return build();
  }

  const role = org.role;
  const organizationId = org.organization.id;

  switch (role) {
    case "OWNER":
      can(["create", "read", "update", "delete"], "Hospital", {
        organizationId,
      });
      can(["create", "read", "update", "delete"], "Equipment", {
        hospital: { organizationId },
      });
      can(["create", "read", "update", "delete"], "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can(["create", "read", "update", "delete"], "Booking", {
        hospital: { organizationId },
      });

      can(["create", "read", "update", "delete"], "Pharmacy", {
        organizationId,
      });
      can(["create", "read", "update", "delete"], "PharmacyDrug", {
        pharmacy: { organizationId },
      });
      break;

    case "MANAGER":
      can(["read", "update"], "Hospital", { organizationId });
      can(["read", "update", "create"], "Equipment", {
        hospital: { organizationId },
      });
      can(["read", "create"], "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can(["read", "update"], "Booking", {
        hospital: { organizationId },
      });
      can(["read", "update"], "PharmacyDrug", {
        pharmacy: { organizationId },
      });
      break;

    case "STAFF":
      can("read", "Equipment", { hospital: { organizationId } });
      can("create", "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can("read", "PharmacyDrug", {
        pharmacy: { organizationId },
      });
      cannot("delete", "Equipment");
      cannot("delete", "EquipmentLog");
      break;

    default:
      cannot(["create", "read", "update", "delete"], "Equipment");
      cannot(["create", "read", "update", "delete"], "EquipmentLog");
      cannot(["create", "read", "update", "delete"], "Hospital");
      cannot(["create", "read", "update", "delete"], "Pharmacy");
      cannot(["create", "read", "update", "delete"], "PharmacyDrug");
      cannot(["create", "read", "update", "delete"], "Booking");
      break;
  }

  return build();
};
