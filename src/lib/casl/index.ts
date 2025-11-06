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
  console.log("user:\t", user);
  const role = user?.user?.roles[0]?.key;
  console.log("role:\t", role);
  const hospitalId = user?.hospital?.id;

  switch (role) {
    case "ADMIN":
      console.log(
        "admin casl---------------------------------------------------"
      );

      can(
        ["create", "read", "update", "delete"],
        ["User", "Equipment", "EquipmentLog", "Hospital"]
      );
      break;

    case "HOSPITAL_ADMIN":
      console.log(
        "hospital_admin ajilljiiinaa\n----------------------------------------------------------------"
      );
      if (!hospitalId) throw new Error("HospitalAdmin must have a hospital");
      can(["create", "read", "update", "delete"], "User", { hospitalId });
      can(["create", "read", "update", "delete"], "Equipment", { hospitalId });
      can(["create", "read", "update", "delete"], "EquipmentLog", {
        equipment: { hospitalId },
      });
      break;

    case "STAFF":
      console.log(
        "staff casl---------------------------------------------------"
      );

      if (hospitalId) can("read", "Equipment", { hospitalId });
      if (user?.user?.id)
        can("update", "EquipmentLog", { userId: user.user.id });
      break;
    case undefined:
      console.log(
        "undefined casl---------------------------------------------------"
      );

      cannot("all", ["User", "Equipment", "EquipmentLog", "Hospital"]);
      break;

    default:
      console.log(
        "default casl---------------------------------------------------"
      );

      cannot("all", ["User", "Equipment", "EquipmentLog", "Hospital"]);
      break;
  }

  return build();
};
