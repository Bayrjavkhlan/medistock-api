"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.CurrentUser = (0, nexus_1.queryField)("currentUser", {
    type: types_1.AuthUserObject,
    resolve: async (_, __, ctx) => {
        if (!ctx.reqUser?.user)
            return null;
        return ctx.reqUser.user;
    },
});
//# sourceMappingURL=current-user.js.map