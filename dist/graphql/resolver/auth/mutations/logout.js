"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = void 0;
const nexus_1 = require("nexus");
const auth_1 = require("../../../../lib/auth");
const types_1 = require("../types");
exports.Logout = (0, nexus_1.mutationField)("logout", {
    type: types_1.LogoutPayload,
    resolve: async (_parent, _args, ctx) => {
        (0, auth_1.clearAuthCookies)(ctx.res);
        return {
            message: "Системээс амжилттай гарлаа.",
        };
    },
});
//# sourceMappingURL=logout.js.map