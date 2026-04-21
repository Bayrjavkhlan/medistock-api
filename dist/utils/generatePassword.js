"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const bcrypt_1 = require("bcrypt");
const config_1 = require("../config");
const PASS_LENGTH = 8;
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
const generatePassword = (email) => {
    let password = Array.from({ length: PASS_LENGTH }, () => CHARSET[Math.floor(Math.random() * CHARSET.length)]).join("");
    if (email.includes("@test.com"))
        password = config_1.env.DEFAULT_PASSWORD;
    const passwordHashed = (0, bcrypt_1.hashSync)(password, 10);
    return { password, passwordHashed };
};
exports.generatePassword = generatePassword;
//# sourceMappingURL=generatePassword.js.map