import { RequestHandler, Request, Response } from "express";
import sanitiszeHtml from "sanitize-html";

// config
import { config } from "../config/env.config";

// util
import { redisGet, redisSet, redisDelete } from "../util/redis.util";
import { createJwt } from "../util/jwt.util";

// data
import { UserData } from "../data/user.data";

// type
import {
  LoginMessage,
  AuthcodeError,
  PasswordError,
  EmailError,
} from "../types/auth.types";
import { compareText, hashingText } from "../util/crypto.util";
import { sendAuthcodeMail } from "../util/mail.util";
import { AuthRequest } from "../types/http.types";
import { getOnlineState } from "../event/friend.event";
import { loginSchema } from "../validation/auth.validate";
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
export const loginControl: RequestHandler = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    const result = await loginSchema.safeParseAsync(req.body);

    if (!result.success) {
      let errorField = result.error.issues[0];
      throw {
        status: 400,
        path: errorField.path[0],
        msg: errorField.message,
      };
    }

    let response = await UserData.getUserByEmail(email);
    let user = await response[0];

    if (!user)
      throw {
        status: 404,
        path: "email",
        msg: EmailError.EMAIL_UNDEFINED_ERROR,
      };
    let check_pw = (await user.password) as string;
    let password_result: boolean = await compareText(password, check_pw);

    // // 비밀번호가 올바르지 않다면
    if (!password_result)
      throw {
        status: 400,
        path: "password",
        msg: PasswordError.PASSWORD_UNEQUAL_ERROR,
      };

    // 여기서부턴 로그인 성공후 프로세스
    let sessionId = await hashingText(email);
    delete user["password"];

    // // 로그인이 성공한거임
    await redisSet(
      sessionId,
      JSON.stringify(user),
      config.session.session_expire
    );
    let csrf_token = await createJwt({ email: user.email }, "refresh");

    // // cookie section
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

    res.status(200).json({ msg: LoginMessage.SUCCESS });
  } catch (err) {
    next(err);
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
    next(err);
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
    next();
  }
};
