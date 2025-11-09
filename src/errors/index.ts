import { AuthErrorMap, AuthErrors } from "./auth";
import { HospitalErrorMap, HospitalErrors } from "./hospital";
import { SystemErrorMap, SystemErrors } from "./system";
import { UserErrorMap, UserErrors } from "./user";

export * from "@/errors/formatter";

export const ErrorMap = {
  ...AuthErrorMap,
  ...UserErrorMap,
  ...SystemErrorMap,
  ...HospitalErrorMap,
};

export const Errors = {
  Auth: AuthErrors,
  User: UserErrors,
  System: SystemErrors,
  Hospital: HospitalErrors,
};
