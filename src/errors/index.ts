import { AuthErrorMap, AuthErrors } from "./auth";
import { EquipmentErrorMap, EquipmentErrors } from "./equipment";
import { EquipmentLogErrorMap, EquipmentLogErrors } from "./equipmentLog";
import { HospitalErrorMap, HospitalErrors } from "./hospital";
import { StaffErrorMap, StaffErrors } from "./staff";
import { SystemErrorMap, SystemErrors } from "./system";

export * from "@/errors/formatter";

export const ErrorMap = {
  ...AuthErrorMap,
  ...StaffErrorMap,
  ...SystemErrorMap,
  ...HospitalErrorMap,
  ...EquipmentErrorMap,
  ...EquipmentLogErrorMap,
};

export const Errors = {
  Auth: AuthErrors,
  Staff: StaffErrors,
  System: SystemErrors,
  Hospital: HospitalErrors,
  Equipment: EquipmentErrors,
  EquipmentLog: EquipmentLogErrors,
};
