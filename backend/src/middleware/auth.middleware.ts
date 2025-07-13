import { RequestHandler } from "express";

// other file
import { nicknameOverlap, emailOverlap } from "../data/auth.data";
import { sendAuthcodeMail } from "../util/mail.util";
import { config } from "../config/env.config";

// types
import { User } from "../types/user.types";

import { hashingText } from "../util/crypto.util";
import { redisGet, redisSet } from "../util/redis.util";
import { AuthcodeError, EmailError, NicknameError } from "../types/auth.types";
import { emailFormValidate } from "../validation/auth.validate";
import { AuthRequest, RequestQuery } from "../types/http.types";
import { verifyJwt } from "../util/jwt.util";

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
export const emailOverlapCheck: RequestHandler = async (req, res) => {
  let { email, overlap } = req.body;
  let overlap_state = overlap == "false" ? false : "true";
  try {
    if (!emailFormValidate(email))
      throw { path: "email", msg: EmailError.EMAIL_FORM_ERROR };

    let user = await emailOverlap(email);

    // 겹치는게 있으면 안 됨
    if (!overlap_state) {
      if (user.length)
        throw { path: "email", msg: EmailError.EMAIL_OVERLAP_ERROR };
    } else {
      if (!user.length)
        throw { path: "email", msg: EmailError.EMAIL_UNDEFINED_ERROR };
    }

    res.status(200).json({ msg: "문제 없음" });
  } catch (error) {
    res.status(400).json(error);
  }
};

// 닉네임 중복검사
export const nicknameOverlapCheck: RequestHandler = async (req, res) => {
  let { nickname } = req.body;
  try {
    let user = await nicknameOverlap(nickname);
    if (user.length)
      throw {
        path: "nickname",
        msg: NicknameError.NICKNAME_OVERLAP_ERROR,
      };
    res.status(200).json({ msg: "문제 없음" });
  } catch (error) {
    res.status(400).json(error);
  }
};
