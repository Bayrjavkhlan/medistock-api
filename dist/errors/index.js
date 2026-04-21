"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.ErrorMap = void 0;
const auth_1 = require("./auth");
const booking_1 = require("./booking");
const drug_1 = require("./drug");
const equipment_1 = require("./equipment");
const equipmentLog_1 = require("./equipmentLog");
const hospital_1 = require("./hospital");
const membership_1 = require("./membership");
const pharmacy_1 = require("./pharmacy");
const system_1 = require("./system");
const user_1 = require("./user");
__exportStar(require("../errors/formatter"), exports);
exports.ErrorMap = {
    ...auth_1.AuthErrorMap,
    ...system_1.SystemErrorMap,
    ...hospital_1.HospitalErrorMap,
    ...pharmacy_1.PharmacyErrorMap,
    ...drug_1.DrugErrorMap,
    ...equipment_1.EquipmentErrorMap,
    ...equipmentLog_1.EquipmentLogErrorMap,
    ...user_1.UserErrorMap,
    ...booking_1.BookingErrorMap,
    ...membership_1.MembershipErrorMap,
};
exports.Errors = {
    Auth: auth_1.AuthErrors,
    System: system_1.SystemErrors,
    Hospital: hospital_1.HospitalErrors,
    Pharmacy: pharmacy_1.PharmacyErrors,
    Drug: drug_1.DrugErrors,
    Equipment: equipment_1.EquipmentErrors,
    EquipmentLog: equipmentLog_1.EquipmentLogErrors,
    User: user_1.UserErrors,
    Booking: booking_1.BookingErrors,
    Membership: membership_1.MembershipErrors,
};
//# sourceMappingURL=index.js.map