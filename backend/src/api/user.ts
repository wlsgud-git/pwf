import express, { Router } from "express";

// middleware
import {
  sendAuthcodeWithEmail,
  userOverlapCheck,
  testFunction,
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

router.get("/current", IsAuth, current);

// 회원가입 관련 ---------------------------------
// 회원가입시 유저정보 확인
router.post(
  "/user_info",
  signupUserValidate, // 정보 검증
  sendAuthcodeWithEmail // 이메일에 인증코드 보냄
);
// 회원가입
router.post("/account", authcodeCheck, accountUser);

// 로그인 -----------------------------
router.post("/login", loginValidate, loginControl);

// 친구요청
router.post("/request/friend", requestFriendWithNickname);
router.post("/request/friend/response", handleRequestFriend);

// 인증코드 전송 ---- nodemailer send Authdo -
router.post("/send_authcode", sendAuthcodeWithEmail);
// 닉네임이나 이메일 중복검사
router.post("/overlap_check", userOverlapCheck);
// 로그아웃
router.post("/logout", logoutControl);

router.post("/test", testFunction);

module.exports = router;
