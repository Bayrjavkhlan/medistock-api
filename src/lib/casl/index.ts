import { AbilityBuilder, PureAbility } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import {
  Booking,
  Drug,
  Equipment,
  EquipmentLog,
  Hospital,
  Membership,
  Pharmacy,
  PharmacyDrug,
  User,
} from "@prisma/client";

import { Errors } from "@/errors";
import { Context } from "@/graphql/context";

export type Action = "manage" | "create" | "read" | "update" | "delete";

type PrismaSubjects = Subjects<{
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
  Pharmacy: Pharmacy;
  PharmacyDrug: PharmacyDrug;
  Booking: Booking;
  Drug: Drug;
  User: User;
  Membership: Membership;
}>;

type SubjectMap = {
  Equipment: Equipment;
  EquipmentLog: EquipmentLog;
  Hospital: Hospital;
  Pharmacy: Pharmacy;
  PharmacyDrug: PharmacyDrug;
  Booking: Booking;
  Drug: Drug;
  User: User;
  Membership: Membership;
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
    can("manage", "Equipment");
    can("manage", "EquipmentLog");
    can("manage", "Hospital");
    can("manage", "Pharmacy");
    can("manage", "PharmacyDrug");
    can("manage", "Booking");
    can("manage", "Drug");
    can("manage", "User");
    can("manage", "Membership");
    return build();
  }

  if (!org) {
    cannot(["create", "read", "update", "delete"], "Equipment");
    cannot(["create", "read", "update", "delete"], "EquipmentLog");
    cannot(["create", "read", "update", "delete"], "Hospital");
    cannot(["create", "read", "update", "delete"], "Pharmacy");
    cannot(["create", "read", "update", "delete"], "PharmacyDrug");
    cannot(["create", "read", "update", "delete"], "Booking");
    cannot(["create", "read", "update", "delete"], "Drug");
    cannot(["create", "read", "update", "delete"], "User");
    cannot(["create", "read", "update", "delete"], "Membership");
    return build();
  }

  const role = org.role;
  const organizationId = org.organization.id;

  switch (role) {
    case "OWNER":
      can("manage", "Hospital", { organizationId });
      can("manage", "Equipment", { hospital: { organizationId } });
      can("manage", "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can("manage", "Booking", { hospital: { organizationId } });
      can("manage", "Pharmacy", { organizationId });
      can("manage", "PharmacyDrug", { pharmacy: { organizationId } });
      can("manage", "Membership", { organizationId });
      can(["read", "create", "update", "delete"], "Drug");
      can(["create", "read", "update", "delete"], "User", {
        memberships: { some: { organizationId } },
      });
      break;

    case "MANAGER":
      can(["create", "read", "update"], "Hospital", { organizationId });
      can(["create", "read", "update"], "Equipment", {
        hospital: { organizationId },
      });
      can(["create", "read", "update"], "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can(["create", "read", "update"], "Booking", {
        hospital: { organizationId },
      });
      can(["create", "read", "update"], "Pharmacy", { organizationId });
      can(["create", "read", "update"], "PharmacyDrug", {
        pharmacy: { organizationId },
      });
      can(["read", "create", "update"], "Drug");
      can(["create", "read", "update"], "User", {
        memberships: { some: { organizationId } },
      });
      can("read", "Membership", { organizationId });
      cannot(["create", "update", "delete"], "Membership");
      cannot("delete", "Hospital");
      cannot("delete", "Equipment");
      cannot("delete", "EquipmentLog");
      cannot("delete", "Booking");
      cannot("delete", "Pharmacy");
      cannot("delete", "PharmacyDrug");
      cannot("delete", "Drug");
      cannot("delete", "User");
      break;

    case "STAFF":
      if (org.organization.type === "PHARMACY") {
        can(["create", "read", "update", "delete"], "Drug");
      } else {
        can("read", "Drug");
      }
      can("read", "Hospital", { organizationId });
      can("read", "Equipment", { hospital: { organizationId } });
      can("read", "Booking", { hospital: { organizationId } });
      can("read", "Pharmacy", { organizationId });
      can("read", "PharmacyDrug", { pharmacy: { organizationId } });
      can("read", "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      can("read", "User", {
        memberships: { some: { organizationId } },
      });
      can("create", "EquipmentLog", {
        equipment: { hospital: { organizationId } },
      });
      cannot(["create", "read", "update", "delete"], "Membership");
      cannot("update", "EquipmentLog");
      cannot("delete", "EquipmentLog");
      cannot("create", "Equipment");
      cannot("update", "Equipment");
      cannot("delete", "Equipment");
      cannot("create", "Booking");
      cannot("update", "Booking");
      cannot("delete", "Booking");
      cannot("create", "Pharmacy");
      cannot("update", "Pharmacy");
      cannot("delete", "Pharmacy");
      cannot("create", "PharmacyDrug");
      cannot("update", "PharmacyDrug");
      cannot("delete", "PharmacyDrug");
      cannot("create", "User");
      cannot("update", "User");
      cannot("delete", "User");
      break;

    default:
      cannot(["create", "read", "update", "delete"], "Equipment");
      cannot(["create", "read", "update", "delete"], "EquipmentLog");
      cannot(["create", "read", "update", "delete"], "Hospital");
      cannot(["create", "read", "update", "delete"], "Pharmacy");
      cannot(["create", "read", "update", "delete"], "PharmacyDrug");
      cannot(["create", "read", "update", "delete"], "Booking");
      cannot(["create", "read", "update", "delete"], "Drug");
      cannot(["create", "read", "update", "delete"], "User");
      cannot(["create", "read", "update", "delete"], "Membership");
      break;
  }

  return build();
};
