"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shieldMiddleware = exports.permissions = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const graphql_shield_1 = require("graphql-shield");
const errors_1 = require("../../errors");
const casl_1 = require("../../lib/casl");
const RateLimiter_middleware_1 = require("./RateLimiter.middleware");
const isAuthenticated = (0, graphql_shield_1.rule)({ cache: "contextual" })(async (_parent, _arg, ctx) => {
    const isAuthenticated = Boolean(ctx.reqUser?.user?.id);
    if (!isAuthenticated)
        throw errors_1.Errors.Auth.NOT_AUTHORIZED();
    return isAuthenticated;
});
const accessRequired = (action, modelName) => (0, graphql_shield_1.rule)({ cache: "contextual" })(async (_parent, _args, ctx) => {
    if (ctx.reqUser?.user?.isPlatformAdmin) {
        return true;
    }
    try {
        (0, casl_1.accessibleBy)(ctx.caslAbility, action, modelName);
        return true;
    }
    catch (error) {
        const userId = ctx.reqUser?.user?.id ?? "anonymous";
        const orgId = ctx.activeOrg?.organization?.id ?? "none";
        console.warn("[RBAC] Denied", JSON.stringify({ action, modelName, userId, orgId }));
        void error;
        return false;
    }
});
const rl = {
    test: (0, RateLimiter_middleware_1.rateLimit)(5, 10),
    login: (0, RateLimiter_middleware_1.rateLimit)(10, 100),
    strict: (0, RateLimiter_middleware_1.rateLimit)(30, 1000),
    heavy: (0, RateLimiter_middleware_1.rateLimit)(30, 2000),
    normal: (0, RateLimiter_middleware_1.rateLimit)(100, 10_000),
    generous: (0, RateLimiter_middleware_1.rateLimit)(300, 50_000),
};
const permissions = {
    Query: {
        currentUser: (0, graphql_shield_1.and)(isAuthenticated, rl.generous),
        me: (0, graphql_shield_1.and)(isAuthenticated, rl.generous),
        dashboardOverview: (0, graphql_shield_1.and)(isAuthenticated, rl.normal),
        hospitalDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Hospital"), rl.normal),
        hospitals: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Hospital"), rl.normal),
        hospitalOption: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Hospital"), rl.generous),
        adminMapLocations: (0, graphql_shield_1.and)(isAuthenticated, rl.normal),
        equipmentDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Equipment"), rl.normal),
        equipments: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Equipment"), rl.normal),
        equipmentLogDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "EquipmentLog"), rl.normal),
        equipmentLogs: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "EquipmentLog"), rl.normal),
        pharmacyDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Pharmacy"), rl.normal),
        pharmacies: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Pharmacy"), rl.normal),
        pharmacyOption: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Pharmacy"), rl.generous),
        drugDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Drug"), rl.normal),
        drugs: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Drug"), rl.normal),
        pharmacyDrugs: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "PharmacyDrug"), rl.normal),
        userDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "User"), rl.normal),
        users: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "User"), rl.normal),
        bookingDetail: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Booking"), rl.normal),
        bookings: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Booking"), rl.normal),
        memberships: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("read", "Membership"), rl.normal),
    },
    Mutation: {
        login: (0, graphql_shield_1.and)(graphql_shield_1.allow, rl.login),
        refreshAccessToken: (0, graphql_shield_1.and)(graphql_shield_1.allow, rl.login),
        selectOrganization: (0, graphql_shield_1.and)(isAuthenticated, rl.normal),
        hospitalCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Hospital"), rl.strict),
        hospitalUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Hospital"), rl.strict),
        hospitalDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Hospital"), rl.strict),
        equipmentCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Equipment"), rl.normal),
        equipmentUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Equipment"), rl.normal),
        equipmentDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Equipment"), rl.normal),
        equipmentLogCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "EquipmentLog"), rl.normal),
        equipmentLogUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "EquipmentLog"), rl.normal),
        equipmentLogDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "EquipmentLog"), rl.normal),
        pharmacyCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Pharmacy"), rl.strict),
        pharmacyUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Pharmacy"), rl.strict),
        pharmacyDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Pharmacy"), rl.strict),
        drugCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Drug"), rl.strict),
        drugUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Drug"), rl.strict),
        drugDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Drug"), rl.strict),
        pharmacyDrugUpsert: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "PharmacyDrug"), rl.strict),
        pharmacyDrugDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "PharmacyDrug"), rl.strict),
        userCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "User"), rl.strict),
        userUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "User"), rl.strict),
        userDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "User"), rl.strict),
        bookingCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Booking"), rl.strict),
        bookingUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Booking"), rl.strict),
        bookingDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Booking"), rl.strict),
        membershipCreate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("create", "Membership"), rl.strict),
        membershipUpdate: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("update", "Membership"), rl.strict),
        membershipDelete: (0, graphql_shield_1.and)(isAuthenticated, accessRequired("delete", "Membership"), rl.strict),
    },
};
exports.permissions = permissions;
const shieldMiddleware = (0, graphql_shield_1.shield)(permissions, {
    debug: true,
    fallbackError: errors_1.Errors.System.PERMISSION_DENIED(),
});
exports.shieldMiddleware = shieldMiddleware;
//# sourceMappingURL=Shield.middleware.js.map