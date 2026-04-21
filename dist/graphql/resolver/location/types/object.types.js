"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapLocationsPayloadObjectType = exports.DashboardMapLocationObjectType = void 0;
const nexus_1 = require("nexus");
exports.DashboardMapLocationObjectType = (0, nexus_1.objectType)({
    name: "DashboardMapLocation",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("name");
        t.nonNull.string("type");
        t.nonNull.string("address");
        t.string("address2");
        t.nonNull.string("province");
        t.nonNull.string("opensAt");
        t.nonNull.string("closesAt");
        t.nonNull.float("latitude");
        t.nonNull.float("longitude");
    },
});
exports.AdminMapLocationsPayloadObjectType = (0, nexus_1.objectType)({
    name: "AdminMapLocationsPayload",
    definition(t) {
        t.nonNull.list.nonNull.field("hospitals", {
            type: exports.DashboardMapLocationObjectType,
        });
        t.nonNull.list.nonNull.field("drugstores", {
            type: exports.DashboardMapLocationObjectType,
        });
    },
});
//# sourceMappingURL=object.types.js.map