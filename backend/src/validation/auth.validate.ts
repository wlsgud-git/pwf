import {
  AuthcodeError,
  EmailError,
  LoginMessage,
  NicknameError,
  PasswordError,
} from "../types/auth.types";

import { z } from "zod";
import { prisma } from "../config/db.config";

// 이메일 ---------
export const emailFormValidate = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: EmailError.EMAIL_EMPTY })
    .email({
      message: EmailError.EMAIL_FORM_ERROR,
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    });

// 닉네임 --------
export const nicknameFormValidate = () =>
  z
    .string()
    .trim()
    .min(2, { message: NicknameError.NICKNAME_FORM_ERROR })
    .max(12, { message: NicknameError.NICKNAME_FORM_ERROR });

// 비밀번호
export const passwordFormValidate = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(8, { message: PasswordError.PASSWORD_FORM_ERROR })
    .max(20, { message: PasswordError.PASSWORD_FORM_ERROR })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
      message: PasswordError.PASSWORD_FORM_ERROR,
    });

export const AuthSchema = {
  email: z.object({ email: emailFormValidate() }),
  nickname: z.object({ nickname: nicknameFormValidate() }),
  password: z.object({ password: passwordFormValidate() }),
  // 로그인
  login: z.object({
    email: emailFormValidate(),
    password: passwordFormValidate(),
  }),
  // 회원가입
  signup: z
    .object({
      email: emailFormValidate(),
      nickname: nicknameFormValidate(),
      password: passwordFormValidate(),
      password_check: passwordFormValidate(),
    })
    .refine((data) => data.password === data.password_check, {
      message: PasswordError.PASSWORD_CHECK_ERROR,
    }),

  // 인증번호 확인
  checkAuthcode: z.object({
    email: emailFormValidate(),
    authcode: z
      .string()
      .length(6, { message: AuthcodeError.AUTHCODE_LEN_ERROR })
      .regex(/^\d+$/, {
        message: AuthcodeError.AUTHCODE_ONLY_NUM,
      }),
  }),
  // .refine((data) => data.password === data.password_check, {
  //   path: ["password_check"],
  //   message: PasswordError.PASSWORD_CHECK_ERROR,
  // }),
};
