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
import { AuthRequest } from "../types/http.types";
import { verifyJwt } from "../util/jwt.util";
import { AuthSchema } from "../validation/auth.validate";
// import { AppError } from "../error/reqeustFriend.error";

// Authentication Or Authorization --------------------------
// 유저 인가
export const IsAuth: AuthRequest = async (req, res, next) => {
  let session_id = req.cookies["session_id"];

  try {
    let user = await redisGet(session_id);
    if (!user) throw { status: 401, message: "로그인 필요" };
    req.user = JSON.parse(user);
    next();
  } catch (err) {
    next(err);
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
