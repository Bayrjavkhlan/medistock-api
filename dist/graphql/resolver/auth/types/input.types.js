"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpInput = exports.VerifyOtpInput = exports.SignUpInput = exports.LoginInput = void 0;
const nexus_1 = require("nexus");
exports.LoginInput = (0, nexus_1.inputObjectType)({
    name: "LoginInput",
    definition: (t) => {
        t.nonNull.string("email");
        t.nonNull.string("password");
    },
});
exports.SignUpInput = (0, nexus_1.inputObjectType)({
    name: "SignUpInput",
    definition: (t) => {
        t.nonNull.string("email");
        t.nonNull.string("password");
        t.nonNull.string("name");
    },
});
exports.VerifyOtpInput = (0, nexus_1.inputObjectType)({
    name: "VerifyOtpInput",
    definition: (t) => {
        t.nonNull.string("email");
        t.nonNull.string("otp");
    },
});
exports.ResendOtpInput = (0, nexus_1.inputObjectType)({
    name: "ResendOtpInput",
    definition: (t) => {
        t.nonNull.string("email");
    },
});
//# sourceMappingURL=input.types.js.map