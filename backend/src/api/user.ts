import express, { Router } from "express";

// middleware
import {
  sendAuthcodeWithEmail,
  emailOverlapCheck,
  nicknameOverlapCheck,
  authcodeCheck,
  IsAuth,
  csrfProtection,
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
router.post("/login", loginControl); //로그인
router.post("/logout", logoutControl); //로그아웃

// requestFriend ------------------------
router.post(
  "/request/friend",
  IsAuth,
  csrfProtection,
  requestFriendWithNickname
); //친구요청 전송
router.post(
  "/request/friend/response",
  IsAuth,
  csrfProtection,
  handleRequestFriend
); //친구요청 수락/거절

// authcode -------------------------------
router.post("/send_authcode", sendAuthcodeWithEmail);

module.exports = router;
