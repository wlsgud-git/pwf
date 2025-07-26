import { RequestHandler } from "express";

// config
import { config } from "../config/env.config";

// util
import { hashingText } from "../util/crypto.util";
import { getIo } from "../util/socket.util";

// data
import {
  // createUser,
  requestFriend,
  requestFriendhandle,
} from "../data/user.data";
import { UserData } from "../data/user.data";

// types
import { SignupMessage } from "../types/auth.types";
import { User } from "../types/user.types";
import { getOnlineState } from "../event/friend.event";
import { s3FileDelete, s3FileUpload } from "../util/aws.util";
import { lutimesSync } from "fs";
import { signupSchema } from "../validation/auth.validate";

export const deleteController: RequestHandler = async (req, res) => {
  let { email } = req.params;
  try {
    await UserData.deleteUser(email);
    res.status(200).json({ message: `${email} 계정이 삭제되었습니다.` });
  } catch (err) {
    res.status(400).json(err);
  }
};

// 이미지 변경
export const updateProfileImg: RequestHandler = async (req, res) => {
  let { id, key } = req.body;
  let newkey = `user/${id}/${new Date().getTime()}/img`;
  try {
    await s3FileDelete({ key, bucket: config.aws.profile_bucket });
    let url = await s3FileUpload({
      key: newkey,
      bucket: config.aws.profile_bucket,
      file: req.file,
    });
    await UserData.changeProfileImg(id, url, newkey);
    res.status(200).json({ msg: "이미지가 변경되었습니다.", key: newkey, url });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateNickname: RequestHandler = async (req, res) => {
  let { id, nickname } = req.body;
  try {
    await UserData.changeNickname(parseInt(id), nickname);
    res.status(200).json({ msg: "닉네임이 변경되었습니다" });
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
    await UserData.createUser(email, nickname, hash_password);
    res.status(201).json({ message: SignupMessage.SUCCESS });
  } catch (err) {
    next(err);
  }
};

// 친구요청 관련 ------------------------------------
// 닉네임으로 친구요청
export const requestFriendWithNickname: RequestHandler = async (req, res) => {
  let io = getIo();
  let { res_nickname, req_user } = req.body;
  let from: User = JSON.parse(req_user);

  try {
    // 본인에게 보내버림
    if (res_nickname === from.nickname)
      throw { msg: "본인에게 친구요청을 보낼 수 없습니다." };

    let response = await requestFriend(res_nickname, from.nickname);
    if (!response.length)
      throw { msg: "이미 친구이거나 친구요청이 전송되어 있는 상태입니다." };

    io.to(`user:${res_nickname}`).emit("friend_request", { from });

    res
      .status(200)
      .json({ msg: `${res_nickname}에게 친구요청이 전송되었습니다.` });
  } catch (err: any) {
    res
      .status(400)
      .json(err.code == "23503" ? { msg: "존재하지 않는 유저입니다." } : err);
  }
};

// 친구요청 결과
export const handleRequestFriend: RequestHandler = async (req, res) => {
  try {
    let io = getIo();
    let { receiver, sender, response } = req.body;
    receiver = JSON.parse(receiver);
    sender = JSON.parse(sender);
    response = response == "true" ? true : false;

    // // 데이터 베이스 친구요청 업데이트
    await requestFriendhandle(receiver.nickname, sender.nickname, response);

    if (response) {
      receiver.online = getOnlineState(receiver.nickname);
      io.to(`user:${sender.nickname}`).emit("friend_request_handle", receiver);
      sender.online = getOnlineState(sender.nickname);
    }

    res.status(200).json({
      sender,
      response,
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
    await UserData;

    res.status(200).json({ message: "비밀번호가 변경되었습니다" });
  } catch (err) {
    res.status(400).json(err);
  }
};
