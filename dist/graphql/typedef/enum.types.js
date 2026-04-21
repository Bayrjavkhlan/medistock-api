"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingTypeEnum = exports.BookingStatusEnum = exports.EquipmentStateEnum = exports.EquipmentCategoryEnum = exports.EnumSortOrderType = exports.OrganizationTypeEnum = exports.OrganizationRoleEnum = void 0;
const client_1 = require("@prisma/client");
const nexus_1 = require("nexus");
exports.OrganizationRoleEnum = (0, nexus_1.enumType)({
    name: "OrganizationRole",
    members: Object.values(client_1.OrganizationRole),
});
exports.OrganizationTypeEnum = (0, nexus_1.enumType)({
    name: "OrganizationType",
    members: Object.values(client_1.OrganizationType),
});
exports.EnumSortOrderType = (0, nexus_1.enumType)({
    name: "EnumSortOrder",
    members: [client_1.Prisma.SortOrder.asc, client_1.Prisma.SortOrder.desc],
});
exports.EquipmentCategoryEnum = (0, nexus_1.enumType)({
    name: "EquipmentCategory",
    members: Object.values(client_1.EquipmentCategory),
});
exports.EquipmentStateEnum = (0, nexus_1.enumType)({
    name: "EquipmentState",
    members: Object.values(client_1.EquipmentState),
});
exports.BookingStatusEnum = (0, nexus_1.enumType)({
    name: "BookingStatus",
    members: Object.values(client_1.BookingStatus),
});
exports.BookingTypeEnum = (0, nexus_1.enumType)({
    name: "BookingType",
    members: ["GENERAL", "DIAGNOSTIC_TEST"],
});
//# sourceMappingURL=enum.types.js.map