import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result } from "express-validator";
import {
  EmailError,
  LoginMessage,
  NicknameError,
  PasswordError,
} from "../types/auth.types";
import { getUserByEmail } from "../data/user.data";

// 이메일 인가
export const emailFormValidate = (email: string) => {
  let result = email
    .toString()
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return !result ? false : true;
};

// 비밀번호 인가
export const passwordFormValidate = (password: string) => {
  let result = password
    .trim()
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/);

  return !result ? false : true;
};

// 회원가입 유저정보 검증
export const signupUserValidate = [
  //   이메일
  body("email")
    .notEmpty()
    .withMessage(EmailError.EMAIL_FORM_ERROR)
    .custom((value) => emailFormValidate(value))
    .withMessage(EmailError.EMAIL_FORM_ERROR),
  //  닉네임
  body("nickname")
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 12 })
    .withMessage(NicknameError.NICKNAME_FORM_ERROR),
  // 비밀번호 확인
  body("password")
    .custom((value) => passwordFormValidate(value))
    .withMessage(PasswordError.PASSWORD_FORM_ERROR),
  // .withMessage(
  //   "비밀번호는 영문, 숫자, 특수문자를 최소 1개 이상 포함하여야 합니다"
  // ),
  //   비밀번호 확인
  body("password_check")
    .toLowerCase()
    .notEmpty()
    .withMessage(PasswordError.PASSWORD_CHECK_ERROR)
    .custom((value, { req }) => value == req.body.password)
    .withMessage(PasswordError.PASSWORD_CHECK_ERROR),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    console.log(errors.array());
    if (errors.isEmpty()) return next();
    let { path, msg } = errors.array()[0];
    res.status(400).json({ path, msg });
  },
];

// 로그인 유저정보 검증
export const loginValidate = [
  //   이메일
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage(EmailError.EMAIL_FORM_ERROR)
    .custom((value) => emailFormValidate(value))
    .withMessage(EmailError.EMAIL_FORM_ERROR)
    .custom(async (val) => {
      let result = await getUserByEmail(val);
      if (!result.length) throw EmailError.EMAIL_UNDEFINED_ERROR;
      return true;
    }),
  // 비밀번호 확인
  body("password")
    .toLowerCase()
    .isLength({ min: 8, max: 20 })
    .withMessage(PasswordError.PASSWORD_FORM_ERROR)
    .custom((value) => passwordFormValidate(value))
    .withMessage(PasswordError.PASSWORD_FORM_ERROR),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    if (errors.isEmpty()) return next();

    let { path, msg } = errors.array()[0];
    res.status(400).json({ path, msg });
  },
];
