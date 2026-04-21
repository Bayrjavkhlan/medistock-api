"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAbilities = exports.accessibleBy = void 0;
const ability_1 = require("@casl/ability");
const prisma_1 = require("@casl/prisma");
const errors_1 = require("../../errors");
const accessibleBy = (ability, action, modelName
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    if (!ability.can(action, modelName)) {
        throw errors_1.Errors.System.PERMISSION_DENIED();
    }
    const rules = ability.rulesFor(action, modelName);
    return rules.reduce((acc, rule) => {
        if (rule.conditions && typeof rule.conditions === "object") {
            return { ...acc, ...rule.conditions };
        }
        return acc;
    }, {});
};
exports.accessibleBy = accessibleBy;
const createAbilities = (ctx) => {
    const { can, cannot, build } = new ability_1.AbilityBuilder(prisma_1.createPrismaAbility);
    const user = ctx.reqUser?.user;
    const org = ctx.activeOrg;
    if (user?.isPlatformAdmin) {
        can("manage", "Equipment");
        can("manage", "EquipmentLog");
        can("manage", "Hospital");
        can("manage", "Pharmacy");
        can("manage", "PharmacyDrug");
        can("manage", "Booking");
        can("manage", "Symptom");
        can("manage", "SymptomMedication");
        can("manage", "DiagnosticTest");
        can("manage", "DiagnosticTimeSlot");
        can("manage", "Drug");
        can("manage", "User");
        can("manage", "Membership");
        return build();
    }
    if (!org) {
        if (user) {
            can("read", "Symptom");
            can("read", "SymptomMedication");
            can("read", "DiagnosticTest");
            can("read", "DiagnosticTimeSlot");
            can(["create", "read"], "Booking", { patientUserId: user.id });
        }
        can("read", "Hospital");
        can("read", "Pharmacy");
        can("read", "Drug");
        cannot(["create", "read", "update", "delete"], "Equipment");
        cannot(["create", "read", "update", "delete"], "EquipmentLog");
        cannot(["create", "update", "delete"], "Hospital");
        cannot(["create", "update", "delete"], "Pharmacy");
        cannot(["create", "read", "update", "delete"], "PharmacyDrug");
        cannot(["update", "delete"], "Booking");
        cannot(["create", "update", "delete"], "Symptom");
        cannot(["create", "update", "delete"], "SymptomMedication");
        cannot(["create", "update", "delete"], "DiagnosticTest");
        cannot(["create", "update", "delete"], "DiagnosticTimeSlot");
        cannot(["create", "update", "delete"], "Drug");
        cannot(["create", "read", "update", "delete"], "User");
        cannot(["create", "read", "update", "delete"], "Membership");
        return build();
    }
    const role = org.role;
    const organizationId = org.organization.id;
    const doctorAssignmentCondition = user?.id
        ? { assignedDoctorId: user.id }
        : undefined;
    switch (role) {
        case "OWNER":
            can("manage", "Hospital", { organizationId });
            can("manage", "Equipment", { hospital: { organizationId } });
            can("manage", "EquipmentLog", {
                equipment: { hospital: { organizationId } },
            });
            can("manage", "Booking", { hospital: { organizationId } });
            can("manage", "Symptom");
            can("manage", "SymptomMedication");
            can("manage", "DiagnosticTest", { hospital: { organizationId } });
            can("manage", "DiagnosticTimeSlot", {
                diagnosticTest: { hospital: { organizationId } },
            });
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
            can("read", "Symptom");
            can("read", "SymptomMedication");
            can(["create", "read", "update"], "DiagnosticTest", {
                hospital: { organizationId },
            });
            can(["create", "read", "update"], "DiagnosticTimeSlot", {
                diagnosticTest: { hospital: { organizationId } },
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
                can(["create", "read", "update", "delete"], "PharmacyDrug", {
                    pharmacy: { organizationId },
                });
            }
            else {
                can("read", "Drug");
                can("read", "PharmacyDrug", { pharmacy: { organizationId } });
                can("read", "Symptom");
                can("read", "SymptomMedication");
                can("read", "DiagnosticTest", {
                    OR: doctorAssignmentCondition
                        ? [{ hospital: { organizationId } }, doctorAssignmentCondition]
                        : [{ hospital: { organizationId } }],
                });
                can("read", "DiagnosticTimeSlot", {
                    diagnosticTest: {
                        OR: doctorAssignmentCondition
                            ? [{ hospital: { organizationId } }, doctorAssignmentCondition]
                            : [{ hospital: { organizationId } }],
                    },
                });
            }
            can("read", "Hospital", { organizationId });
            can("read", "Equipment", { hospital: { organizationId } });
            can("read", "Booking", {
                OR: doctorAssignmentCondition
                    ? [
                        { hospital: { organizationId } },
                        { diagnosticTest: doctorAssignmentCondition },
                    ]
                    : [{ hospital: { organizationId } }],
            });
            can("read", "Pharmacy", { organizationId });
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
            cannot("create", "Symptom");
            cannot("update", "Symptom");
            cannot("delete", "Symptom");
            cannot("create", "SymptomMedication");
            cannot("update", "SymptomMedication");
            cannot("delete", "SymptomMedication");
            cannot("create", "DiagnosticTest");
            cannot("update", "DiagnosticTest");
            cannot("delete", "DiagnosticTest");
            cannot("create", "DiagnosticTimeSlot");
            cannot("update", "DiagnosticTimeSlot");
            cannot("delete", "DiagnosticTimeSlot");
            cannot("create", "Pharmacy");
            cannot("update", "Pharmacy");
            cannot("delete", "Pharmacy");
            if (org.organization.type !== "PHARMACY") {
                cannot("create", "PharmacyDrug");
                cannot("update", "PharmacyDrug");
                cannot("delete", "PharmacyDrug");
            }
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
            cannot(["create", "read", "update", "delete"], "Symptom");
            cannot(["create", "read", "update", "delete"], "SymptomMedication");
            cannot(["create", "read", "update", "delete"], "DiagnosticTest");
            cannot(["create", "read", "update", "delete"], "DiagnosticTimeSlot");
            cannot(["create", "read", "update", "delete"], "Drug");
            cannot(["create", "read", "update", "delete"], "User");
            cannot(["create", "read", "update", "delete"], "Membership");
            break;
    }
    return build();
};
exports.createAbilities = createAbilities;
//# sourceMappingURL=index.js.map