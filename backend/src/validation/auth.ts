import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result } from "express-validator";
import { LoginMessage, SignupError } from "../../types/auth";
import { getUserByEmail } from "../data/user";

// 이메일 인가
export const emailValidate = (email: string) => {
  return email
    .toString()
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// 비밀번호 인가
export const passwordValidate = (password: string) => {
  return password
    .trim()
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/);
};

// 회원가입 유저정보 검증
export const signupUserValidate = [
  //   이메일
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .isEmail()
    .withMessage(SignupError.EMAIL)
    .custom((value) => emailValidate(value))
    .withMessage(SignupError.EMAIL),
  //  닉네임
  body("nickname")
    .trim()
    .toLowerCase()
    .isLength({ min: 2, max: 12 })
    .withMessage(SignupError.NICKNAME),
  // 비밀번호 확인
  body("password")
    .toLowerCase()
    .isLength({ min: 8, max: 20 })
    .withMessage(SignupError.PASSWORD)
    .custom((value) => passwordValidate(value))
    .withMessage(SignupError.PASSWORD),
  // .withMessage(
  //   "비밀번호는 영문, 숫자, 특수문자를 최소 1개 이상 포함하여야 합니다"
  // ),
  //   비밀번호 확인
  body("password_check")
    .toLowerCase()
    .notEmpty()
    .custom((value, { req }) => value == req.body.password)
    .withMessage(SignupError.PASSWORD_CHECK),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    if (errors.isEmpty()) return next();
    let { path, msg } = errors.array()[0];
    res.status(400).json({ path, msg });
  },
];

// 로그인 유저정보 검증
export const loginValidate = [
  //   이메일
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .isEmail()
    .withMessage(LoginMessage.EMAIL)
    .custom((value) => emailValidate(value))
    .withMessage(LoginMessage.EMAIL)
    .custom(async (val) => {
      let result = await getUserByEmail(val);
      if (!result.length) throw LoginMessage.EMAIL_UNDEFINED;
      return true;
    }),
  // 비밀번호 확인
  body("password")
    .toLowerCase()
    .isLength({ min: 8, max: 20 })
    .withMessage(SignupError.PASSWORD)
    .custom((value) => passwordValidate(value))
    .withMessage(SignupError.PASSWORD),
  // .withMessage(
  //   "비밀번호는 영문, 숫자, 특수문자를 최소 1개 이상 포함하여야 합니다"
  // ),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    if (errors.isEmpty()) return next();

    let { path, msg } = errors.array()[0];
    res.status(400).json({ path, msg });
  },
];
