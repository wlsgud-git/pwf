import { RequestHandler } from "express";

// config
import { config } from "../config/env.config";

// util
import { hashingText } from "../util/crypto.util";
import { getIo } from "../util/socket.util";

// data;
import { UserData } from "../data/user.data";

// types
import { SignupMessage } from "../types/auth.types";
import { getOnlineState } from "../event/friend.event";
import { s3FileDelete, s3FileUpload } from "../util/aws.util";
import {
  requestFriendHandleSchema,
  requestFriendSchema,
  signupSchema,
} from "../validation/auth.validate";
import { AuthRequest } from "../types/http.types";
import { prisma } from "../config/db.config";
import { User } from "../types/user.types";

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
export const requestFriendWithNickname: AuthRequest = async (
  req,
  res,
  next
) => {
  let io = getIo();
  let { receiver } = req.body;

  const schema = requestFriendSchema(req.user?.nickname!);

  try {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      let errorField = result.error.issues[0];
      throw {
        status: 400,
        msg: errorField.message,
      };
    }
    io.to(`user:${receiver}`).emit("friend_request", { from: req.user });

    res.status(200).json({ msg: `${receiver}에게 친구요청이 전송되었습니다.` });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

// 친구요청 결과
export const handleRequestFriend: AuthRequest = async (req, res, next) => {
  let io = getIo();
  let { sender, response } = req.body;

  const schema = requestFriendHandleSchema(req.user?.nickname!);
  try {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      let errorField = result.error.issues[0];
      throw {
        status: 400,
        msg: errorField.message,
      };
    }

    let {
      users_requestfriend_res_nicknameTousers,
      users_requestfriend_req_nicknameTousers,
    } = await UserData.requestFriendHandle(
      req.user?.nickname!,
      sender,
      response
    );

    let res_user: User = await users_requestfriend_res_nicknameTousers;
    let req_user: User = await users_requestfriend_req_nicknameTousers;

    if (response) {
      res_user.online = getOnlineState(res_user.nickname);
      io.to(`user:${sender}`).emit("friend_request_handle", res_user);
      req_user.online = getOnlineState(req_user.nickname);
    }

    res.status(200).json({
      sender: req_user,
      response,
      msg: `${sender}의 요청을 ${
        response ? "수락하였습니다." : "거절하였습니다."
      }`,
    });
  } catch (err) {
    console.log(err);
    next(err);
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
