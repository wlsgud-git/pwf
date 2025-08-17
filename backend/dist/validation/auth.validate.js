"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = exports.passwordFormValidate = exports.nicknameFormValidate = exports.emailFormValidate = void 0;
const auth_types_1 = require("../types/auth.types");
const zod_1 = require("zod");
// 이메일 ---------
const emailFormValidate = () => zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: auth_types_1.EmailError.EMAIL_EMPTY })
    .email({
    message: auth_types_1.EmailError.EMAIL_FORM_ERROR,
    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
});
exports.emailFormValidate = emailFormValidate;
// 닉네임 --------
const nicknameFormValidate = () => zod_1.z
    .string()
    .trim()
    .min(2, { message: auth_types_1.NicknameError.NICKNAME_FORM_ERROR })
    .max(12, { message: auth_types_1.NicknameError.NICKNAME_FORM_ERROR });
exports.nicknameFormValidate = nicknameFormValidate;
// 비밀번호
const passwordFormValidate = () => zod_1.z
    .string()
    .trim()
    .toLowerCase()
    .min(8, { message: auth_types_1.PasswordError.PASSWORD_FORM_ERROR })
    .max(20, { message: auth_types_1.PasswordError.PASSWORD_FORM_ERROR })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    message: auth_types_1.PasswordError.PASSWORD_FORM_ERROR,
});
exports.passwordFormValidate = passwordFormValidate;
exports.AuthSchema = {
    email: zod_1.z.object({ email: (0, exports.emailFormValidate)() }),
    nickname: zod_1.z.object({ nickname: (0, exports.nicknameFormValidate)() }),
    password: zod_1.z.object({ password: (0, exports.passwordFormValidate)() }),
    // 로그인
    login: zod_1.z.object({
        email: (0, exports.emailFormValidate)(),
        password: (0, exports.passwordFormValidate)(),
    }),
    // 회원가입
    signup: zod_1.z
        .object({
        email: (0, exports.emailFormValidate)(),
        nickname: (0, exports.nicknameFormValidate)(),
        password: (0, exports.passwordFormValidate)(),
        password_check: (0, exports.passwordFormValidate)(),
    })
        .refine((data) => data.password === data.password_check, {
        message: auth_types_1.PasswordError.PASSWORD_CHECK_ERROR,
    }),
    // 인증번호 확인
    checkAuthcode: zod_1.z.object({
        email: (0, exports.emailFormValidate)(),
        authcode: zod_1.z
            .string()
            .length(6, { message: auth_types_1.AuthcodeError.AUTHCODE_LEN_ERROR })
            .regex(/^\d+$/, {
            message: auth_types_1.AuthcodeError.AUTHCODE_ONLY_NUM,
        }),
    }),
    // .refine((data) => data.password === data.password_check, {
    //   path: ["password_check"],
    //   message: PasswordError.PASSWORD_CHECK_ERROR,
    // }),
};
