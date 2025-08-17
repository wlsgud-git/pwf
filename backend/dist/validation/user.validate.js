"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
const auth_validate_1 = require("./auth.validate");
const auth_types_1 = require("../types/auth.types");
exports.UserSchema = {
    updateNickname: zod_1.z.object({
        id: zod_1.z.number({ message: "id는 숫자형이여야 합니다." }),
        nickname: (0, auth_validate_1.nicknameFormValidate)(),
    }),
    passwordChange: zod_1.z
        .object({
        email: (0, auth_validate_1.emailFormValidate)(),
        password: (0, auth_validate_1.passwordFormValidate)(),
        password_check: (0, auth_validate_1.passwordFormValidate)(),
    })
        .refine((data) => data.password === data.password_check, {
        message: auth_types_1.PasswordError.PASSWORD_CHECK_ERROR,
    }),
};
