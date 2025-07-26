import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result } from "express-validator";
import {
  EmailError,
  LoginMessage,
  NicknameError,
  PasswordError,
} from "../types/auth.types";
import { getUserByEmail } from "../data/user.data";

import { z } from "zod";
import { prisma } from "../config/db.config";

// 이메일 ---------
export const emailValidate = () =>
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

export const emailValidateWithRefine = emailValidate().refine(
  async (email) => {
    const user = await prisma.users.findUnique({ where: { email } });
    return !user;
  },
  { message: EmailError.EMAIL_OVERLAP_ERROR }
);
// 닉네임 --------
export const nicknameValidate = z
  .string()
  .trim()
  .min(2, { message: NicknameError.NICKNAME_FORM_ERROR })
  .max(12, { message: NicknameError.NICKNAME_FORM_ERROR })
  .refine(
    async (nickname) => {
      const user = await prisma.users.findUnique({ where: { nickname } });
      return !user;
    },
    { message: NicknameError.NICKNAME_OVERLAP_ERROR }
  );

// 비밀번호
export const passwordValidate = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(8, { message: PasswordError.PASSWORD_FORM_ERROR })
    .max(20, { message: PasswordError.PASSWORD_FORM_ERROR })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
      message: PasswordError.PASSWORD_FORM_ERROR,
    });

// 이메일 중복 검사
export const emailOverlapSchema = z.object({
  email: emailValidateWithRefine,
});
// 닉네임 중복검사
export const nicknameOverlapSchema = z.object({
  nickname: nicknameValidate,
});

// 회원가입 정보
export const signupSchema = z
  .object({
    email: emailValidateWithRefine,
    nickname: nicknameValidate,
    password: passwordValidate(),
    password_check: z.string(),
  })
  .refine((data) => data.password === data.password_check, {
    path: ["password_check"],
    message: PasswordError.PASSWORD_CHECK_ERROR,
  });

// 로그인 정보
export const loginSchema = z.object({
  email: emailValidate(),
  password: passwordValidate(),
});
