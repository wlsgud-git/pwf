import { RequestHandler } from "express";

// config
import { config } from "../config/env.config";

// util
import { hashingText } from "../util/crypto.util";
import { getIo } from "../util/socket.util";

// data
import {
  changePassword,
  createUser,
  deleteUser,
  requestFriend,
  requestFriendhandle,
} from "../data/user.data";
import { nicknameOverlap } from "../data/auth.data";

// types
import { SignupMessage } from "../types/auth.types";
import { onlineUser } from "../util/auth.util";

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

// 비밀번호 변경
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
