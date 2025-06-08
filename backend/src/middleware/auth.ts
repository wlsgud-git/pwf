import { RequestHandler } from "express";

// other file
import { nicknameOverlap, emailOverlap } from "../data/user";
import { transporter, sendAuthcodeMail } from "../util/mail";

// types
import { User } from "../../types/user";

import { hashingText } from "../util/crypto";
import { redisGet, redisSet } from "../util/redis";
import { AuthcodeError, SignupError } from "../../types/auth";
import { emailValidate } from "../validation/auth";
import { RequestQuery } from "../../types/http";
import { verifyJwt } from "../util/jwt";

// Authentication Or Authorization --------------------------
// 유저 인가
export const IsAuth: RequestHandler = async (req, res, next) => {
  let session_id = req.cookies["session_id"];

  try {
    if (!session_id) throw { message: "로그인 필요" };
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};

//  이메일 중복체크
export const emailOverlapCheck: RequestHandler = async (req, res) => {
  let { email } = req.body;
  try {
    if (!emailValidate(email)) throw { type: "email", msg: SignupError.EMAIL };
    let user = await emailOverlap(email);
    if (user.length)
      throw {
        type: "email",
        msg: SignupError.EMAIL_OVERLAP,
      };
    res.status(200).json(user[0]);
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
        type: "nickname",
        msg: SignupError.NICKNAME_OVERLAP,
      };
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};

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

// authencate code ---------------------------------
// 인증코드 보내기
export const sendAuthcodeWithEmail: RequestHandler = async (req, res, next) => {
  let { email } = req.body;

  try {
    let auth_code = await sendAuthcodeMail(email);
    await redisSet(email, auth_code, 30);
    res.status(200).json({ message: `${email}에 인증번호를 전송하였습니다.` });
  } catch (err) {
    throw err;
  }
};

// 인증코드 확인
export const authcodeCheck: RequestHandler = async (req, res, next) => {
  let { email, authcode } = req.body;

  try {
    let code = await redisGet(email);

    if (!code) throw { msg: AuthcodeError.AUTHCODE_EXPIRE };
    if (code !== authcode) throw { msg: AuthcodeError.AUTHCODE_UNEQUAL };

    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
