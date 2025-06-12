import { RequestHandler } from "express";
import { compareText, hashingText } from "../util/crypto";
import {
  changePassword,
  createUser,
  deleteUser,
  getUserByEmail,
  nicknameOverlap,
  requestFriend,
  requestFriendhandle,
} from "../data/user";
import { redis, redisDelete, redisGet } from "../util/redis";

import { config } from "../../config";

// types
import { LoginMessage, SignupMessage } from "../../types/auth";
import { User } from "../../types/user";
import { redisSet } from "../util/redis";
import { onlineUser } from "../util/auth";
import { reverse } from "dns";
import { getIo } from "../util/socket";
import { createJwt } from "../util/jwt";

// 현재 유저
export const current: RequestHandler = async (req, res) => {
  try {
    let email = await redisGet(req.cookies["session_id"]);
    if (!email) throw { message: "로그인 필요" };
    let user = await getUserByEmail(email);

    if (user[0].friends)
      user[0].friends = await Promise.all(
        user[0].friends?.map(async (val: User) => await onlineUser(val))
      );

    res.status(200).json(user[0]);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const deleteController: RequestHandler = async (req, res) => {
  let { email } = req.params;
  try {
    await deleteUser(email);
    res.status(200).json({ message: `${email} 계정이 삭제되었습니다.` });
  } catch (err) {
    res.status(400).json(err);
  }
};

// signup -------------------------------------------
// 회원가입 전 유저정보 확인
export const signupUserInfoControl: RequestHandler = async (req, res, next) => {
  res.status(200).json({ message: "success" });
};

// 회원가입
export const accountUser: RequestHandler = async (req, res, next) => {
  let { email, nickname, password } = req.body;

  try {
    let hash_password = await hashingText(password);
    await createUser({ email, nickname, password: hash_password });
    res.status(201).json({ message: SignupMessage.SUCCESS });
  } catch (err) {
    throw err;
  }
};

// login -------------------------------------
// 로그인
export const loginControl: RequestHandler = async (req, res) => {
  let { email, password } = req.body;
  try {
    let response = await getUserByEmail(email);
    let user = await response[0];
    let check_password = await user!.password;

    let result: boolean = await compareText(password, check_password!);

    // 비밀번호가 올바르지 않다면
    if (!result) throw { path: "password", msg: LoginMessage.PASSWORD_UNEQUAL };

    // 로그인이 성공한거임
    if (user.nickname)
      await redisSet(user.nickname, email, config.session.session_expire);

    let csrf_token = await createJwt({ email: user.email }, "refresh");
    // cookie section
    res.cookie("session_id", user.nickname, {
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

// 친구요청 관련 ------------------------------------
// 닉네임으로 친구요청
export const requestFriendWithNickname: RequestHandler = async (req, res) => {
  let { res_nickname, req_nickname, state } = req.body;
  try {
    // 본인에게 보내버림
    if (res_nickname == req_nickname) throw { msg: "잘못된 친구요청입니다." };

    // 없는 닉네임
    let user = await nicknameOverlap(res_nickname);
    if (!user.length) throw { msg: "존재하지 않은 닉네임입니다." };

    let response = await requestFriend(res_nickname, req_nickname, state);

    res
      .status(200)
      .json({ msg: `${res_nickname}에게 친구요청이 전송되었습니다.` });
  } catch (err) {
    res.status(400).json(err);
  }
};

// 친구요청 결과
export const handleRequestFriend: RequestHandler = async (req, res) => {
  try {
    let soc = getIo();
    let { receiver, sender, response } = req.body;
    receiver = JSON.parse(receiver);
    sender = JSON.parse(sender);
    response = response == "true" ? true : false;

    // 데이터 베이스 친구요청 업데이트
    await requestFriendhandle(receiver.nickname, sender.nickname, response);

    if (response) {
      receiver.online = true;
      // 현재 sender가 접속중인지 확인
      await onlineUser(sender);

      if (sender.online)
        soc.to(`online:${sender.nickname}`).emit("receiver data", receiver);
    }

    res.status(200).json({
      sender,
      msg: `${sender.nickname}의 요청을 ${
        response ? "수락하였습니다." : "거절하였습니다."
      }`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const passwordChange: RequestHandler = async (req, res) => {
  let { email, password } = req.body;
  try {
    let hash_pw = await hashingText(password);
    await changePassword(email, hash_pw);

    res.status(200).json({ message: "비밀번호가 변경되었습니다" });
  } catch (err) {
    res.status(400).json(err);
  }
};
