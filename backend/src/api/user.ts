import express, { Router } from "express";

// middleware
import {
  sendAuthcodeWithEmail,
  emailOverlapCheck,
  nicknameOverlapCheck,
  authcodeCheck,
  IsAuth,
} from "../middleware/auth";

// controller
import {
  accountUser,
  current,
  handleRequestFriend,
  loginControl,
  requestFriendWithNickname,
  logoutControl,
} from "../controller/user";
import { loginValidate, signupUserValidate } from "../validation/auth";

const router: Router = express.Router();

//  authentication  Or  authorization
router.get("/current", IsAuth, current);
router.post("/email/overlap", emailOverlapCheck);
router.post("/nickname/overlap", nicknameOverlapCheck);

// signup ----------------------------
router.post("/account", authcodeCheck, accountUser);
router.post(
  "/user_info",
  signupUserValidate, // 정보 검증
  sendAuthcodeWithEmail // 이메일에 인증코드 보냄
); // 회원가입시 유저정보 확인

// login -----------------------------
router.post("/login", loginValidate, loginControl); //로그인
router.post("/logout", logoutControl); //로그아웃

// requestFriend ------------------------
router.post("/request/friend", requestFriendWithNickname); //친구요청 전송
router.post("/request/friend/response", handleRequestFriend); //친구요청 수락/거절

// 인증코드 전송 ---- nodemailer send Authdo -
router.post("/send_authcode", sendAuthcodeWithEmail);

module.exports = router;
