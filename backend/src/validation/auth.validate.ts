import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result } from "express-validator";
import {
  EmailError,
  LoginMessage,
  NicknameError,
  PasswordError,
} from "../types/auth.types";

import { z } from "zod";
import { prisma } from "../config/db.config";
import { UserData } from "../data/user.data";

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

export const requestFriendSchema = (nickname: string) =>
  z.object({
    receiver: z
      .string()
      .trim()
      .min(2, { message: "닉네임은 2글자 이상입니다" })
      .max(12, { message: "닉네임은 12자 이하입니다" })
      .superRefine(async (val, ctx) => {
        // 본인에게 요청
        if (val === nickname) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "본인에게 친구요청을 보낼 수 없습니다",
          });
          return;
        }

        // 존재하지 않은 닉네임
        const user = await prisma.users.findUnique({
          where: { nickname: val },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "유저가 존재하지 않습니다",
          });
          return;
        }

        const result = await UserData.requestFriend(val, nickname);
        if (!result.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "이미 친구이거나 친구요청이 존재합니다",
          });
          return;
        }
      }),
    // .refine(
    //   async (reciever) => {
    //     console.log("실행되는데?");
    //     const result = await UserData.requestFriend(reciever, nickname);
    //     return result.length;
    //   },
    //   { message: "이미 친구이거나 친구요청이 있습니다." }
    // ),
  });

export const requestFriendHandleSchema = (nickname: string) =>
  z.object({
    sender: z
      .string()
      .trim()
      .min(2, { message: "닉네임은 2글자 이상입니다" })
      .max(12, { message: "닉네임은 12자 이하입니다" })
      .superRefine(async (val, ctx) => {
        // 존재하지 않은 닉네임
        console.log(val);
        const user = await prisma.users.findUnique({
          where: { nickname: val },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "유저가 존재하지 않습니다",
          });
          return;
        }

        const exist = await prisma.requestfriend.findUnique({
          where: {
            res_nickname_req_nickname: {
              res_nickname: nickname,
              req_nickname: val,
            },
          },
        });

        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "친구요청이 존재하지 않습니다",
          });
          return;
        }
      }),
    response: z.boolean({ message: "boolean타입이 아닙니다" }),
    // .refine(
    //   async (reciever) => {
    //     console.log("실행되는데?");
    //     const result = await UserData.requestFriend(reciever, nickname);
    //     return result.length;
    //   },
    //   { message: "이미 친구이거나 친구요청이 있습니다." }
    // ),
  });
