import { AuthErrorMap, AuthErrors } from "./auth";
import { BookingErrorMap, BookingErrors } from "./booking";
import { DrugErrorMap, DrugErrors } from "./drug";
import { EquipmentErrorMap, EquipmentErrors } from "./equipment";
import { EquipmentLogErrorMap, EquipmentLogErrors } from "./equipmentLog";
import { HospitalErrorMap, HospitalErrors } from "./hospital";
import { MembershipErrorMap, MembershipErrors } from "./membership";
import { PharmacyErrorMap, PharmacyErrors } from "./pharmacy";
import { SystemErrorMap, SystemErrors } from "./system";
import { UserErrorMap, UserErrors } from "./user";

export * from "@/errors/formatter";

export const ErrorMap = {
  ...AuthErrorMap,
  ...SystemErrorMap,
  ...HospitalErrorMap,
  ...PharmacyErrorMap,
  ...DrugErrorMap,
  ...EquipmentErrorMap,
  ...EquipmentLogErrorMap,
  ...UserErrorMap,
  ...BookingErrorMap,
  ...MembershipErrorMap,
};

export const Errors = {
  Auth: AuthErrors,
  System: SystemErrors,
  Hospital: HospitalErrors,
  Pharmacy: PharmacyErrors,
  Drug: DrugErrors,
  Equipment: EquipmentErrors,
  EquipmentLog: EquipmentLogErrors,
  User: UserErrors,
  Booking: BookingErrors,
  Membership: MembershipErrors,
};
