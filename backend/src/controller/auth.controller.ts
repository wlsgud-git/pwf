import { RequestHandler, Request, Response } from "express";

// config
import { config } from "../config/env.config";

// util
import { redisGet, redisSet, redisDelete } from "../util/redis.util";
import { createJwt } from "../util/jwt.util";

// data
import { getMyFriends, getUserByEmail } from "../data/user.data";

// type
import { User } from "../types/user.types";
import {
  LoginMessage,
  AuthcodeError,
  PasswordError,
} from "../types/auth.types";
import { compareText, hashingText } from "../util/crypto.util";
import { sendAuthcodeMail } from "../util/mail.util";
import { AuthRequest } from "../types/http.types";
import { getIo } from "../util/socket.util";
import { getOnlineState } from "../event/friend.event";
// import "../types/express/express";

// 현재 유저
export const current: AuthRequest = async (req, res) => {
  try {
    if (!req.user) throw { message: "로그인 필요" };

    // 친구들 온라인 상태확인
    req.user.friends = req.user.friends?.map((val) => {
      return {
        ...val,
        online: getOnlineState(val.nickname),
      };
    });

    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(400).json(err);
  }
};

// login -------------------------------------
// 로그인
export const loginControl: RequestHandler = async (req, res) => {
  let { email, password } = req.body;
  try {
    let response = await getUserByEmail(email);
    let user: User | null = await response[0];
    let check_password = await user!.password;

    let result: boolean = await compareText(password, check_password!);

    // 비밀번호가 올바르지 않다면
    if (!result)
      throw { path: "password", msg: PasswordError.PASSWORD_UNEQUAL_ERROR };

    let sessionId = await hashingText(email);
    delete user["password"];

    // 로그인이 성공한거임
    await redisSet(
      sessionId,
      JSON.stringify(user),
      config.session.session_expire
    );
    let csrf_token = await createJwt({ email: user.email }, "refresh");

    // cookie section
    res.cookie("session_id", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: config.session.session_expire * 1000,
      path: "/",
    });

    res.cookie("csrf_token", csrf_token, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: config.session.session_expire * 1000,
      path: "/",
    });
    delete user["password"];

    res.status(200).json({ user, message: LoginMessage.SUCCESS });
  } catch (err) {
    res.status(400).json(err);
  }
};

// 로그아웃
export const logoutControl: RequestHandler = async (req, res) => {
  try {
    await redisDelete(req.cookies["session_id"]);
    res.clearCookie("session_id");
    res.status(200).json({ msg: "로그아웃 되었습니다." });
  } catch (error) {
    res.status(400).json(error);
  }
};

// authencate code ---------------------------------
// 인증코드 보내기
export const sendAuthcodeController: RequestHandler = async (
  req,
  res,
  next
) => {
  let { email } = req.body;

  try {
    let auth_code = await sendAuthcodeMail(email);
    await redisSet(email, auth_code, config.authcode.expires);
    res.status(200).json({ message: `${email}에 인증번호를 전송하였습니다.` });
  } catch (err) {
    throw err;
  }
};

// 인증코드 확인
export const checkAuthcodeController: RequestHandler = async (
  req,
  res,
  next
) => {
  let { email, authcode } = req.body;

  try {
    let code = await redisGet(email);

    if (!code) throw { msg: AuthcodeError.AUTHCODE_EXPIRE };
    if (code !== authcode) throw { msg: AuthcodeError.AUTHCODE_UNEQUAL };

    res.status(200).json({ msg: "인증이 완료되었습니다." });
  } catch (err) {
    res.status(400).json(err);
  }
};
