import { RequestHandler } from "express";

// other file
import { AuthData } from "../data/auth.data";
import { sendAuthcodeMail } from "../util/mail.util";
import { config } from "../config/env.config";

// types
import { User } from "../types/user.types";

import { hashingText } from "../util/crypto.util";
import { redisGet, redisSet } from "../util/redis.util";
import { AuthcodeError, EmailError, NicknameError } from "../types/auth.types";
// import { emailFormValidate } from "../validation/auth.validate";
import { AuthRequest, RequestQuery } from "../types/http.types";
import { verifyJwt } from "../util/jwt.util";
import {
  emailOverlapSchema,
  nicknameOverlapSchema,
  signupSchema,
} from "../validation/auth.validate";
// import { AppError } from "../error/reqeustFriend.error";

// Authentication Or Authorization --------------------------
// 유저 인가
export const IsAuth: AuthRequest = async (req, res, next) => {
  let session_id = req.cookies["session_id"];

  try {
    let user = await redisGet(session_id);
    if (!user) throw { message: "로그인 필요" };
    req.user = JSON.parse(user);
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};

// csrf 검증
export const csrfProtection: RequestHandler = async (req, res, next) => {
  try {
    let token = req.cookies["csrf_token"];
    let result = await verifyJwt(token);

    if (!result) throw new Error("csrf_token 갱신이 필요합니다");
    next();
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//  이메일 중복체크
export const emailOverlapCheck: RequestHandler = async (req, res, next) => {
  let result = await emailOverlapSchema.safeParseAsync(req.body);
  if (!result.success) {
    let errorField = result.error.issues[0];
    return next({ status: 409, path: "email", msg: errorField.message });
  }

  res.status(200).json({ msg: `이메일이 중복되지 않습니다.` });
};

// 닉네임 중복검사
export const nicknameOverlapCheck: RequestHandler = async (req, res, next) => {
  let result = await nicknameOverlapSchema.safeParseAsync(req.body);
  if (!result.success) {
    let errorField = result.error.issues[0];
    return next({ status: 409, path: "nickname", msg: errorField.message });
  }

  res.status(200).json({ msg: `닉네임이 중복되지 않습니다.` });
};

// 회원가입 유저정보 검증
export const signupValidation: RequestHandler = async (req, res, next) => {
  try {
    let result = await signupSchema.safeParseAsync(req.body);

    if (!result.success) {
      let errorField = result.error.issues[0];
      throw {
        status: 409,
        path: errorField.path[0],
        msg: errorField.message,
      };
    }

    next();
  } catch (err) {
    next(err);
  }
};
