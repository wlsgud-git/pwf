import { RequestHandler } from "express";

// other file
import { overlapCheck } from "../data/user";
import { transporter, sendAuthcodeMail } from "../util/mail";

// types
import { User } from "../../types/user";

import { hashingText } from "../util/crypto";
import { redisGet, redisSet } from "../util/redis";
import { AuthcodeError, SignupError } from "../../types/auth";
import { emailValidate } from "../validation/auth";
import { RequestQuery } from "../../types/http";

// 유저 인가 middleware
export const IsAuth: RequestHandler = async (req, res, next) => {
  let session_id = req.cookies["session_id"];

  try {
    if (!session_id) throw { message: "로그인 필요" };
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};

// 회원가입 이메일과 닉네임 중복체크
export const userOverlapCheck: RequestHandler = async (req, res) => {
  let { type, value } = req.body;
  try {
    if (type == "email" && !emailValidate(value))
      throw { type, msg: SignupError.EMAIL };
    let user = await overlapCheck(type, value);
    if (user.length)
      throw {
        type,
        msg:
          type == "email"
            ? SignupError.EMAIL_OVERLAP
            : SignupError.NICKNAME_OVERLAP,
      };
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};

// 이메일에 인증코드 보내기
// nomailer를 이용하여 인증코드 보냄 - 레디스에 저장함
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

// 이메일의 인증코드 확인
// 인증코드를 받음 - 해당 이메일에 맞는 인증번호가 있는지 확인함
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

// 테스트
export const testFunction: RequestHandler = async (req, res, next) => {
  let { email } = req.body;
  try {
    let code = await redisGet(email);
    res.status(200).json({ code });
  } catch (err) {
    throw err;
  }
};
