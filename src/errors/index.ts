import { AuthErrorMap, AuthErrors } from "./auth";
import { EquipmentErrorMap, EquipmentErrors } from "./equipment";
import { EquipmentLogErrorMap, EquipmentLogErrors } from "./equipmentLog";
import { HospitalErrorMap, HospitalErrors } from "./hospital";
import { SystemErrorMap, SystemErrors } from "./system";

export * from "@/errors/formatter";

export const ErrorMap = {
  ...AuthErrorMap,
  ...SystemErrorMap,
  ...HospitalErrorMap,
  ...EquipmentErrorMap,
  ...EquipmentLogErrorMap,
};

export const Errors = {
  Auth: AuthErrors,
  System: SystemErrors,
  Hospital: HospitalErrors,
  Equipment: EquipmentErrors,
  EquipmentLog: EquipmentLogErrors,
};
