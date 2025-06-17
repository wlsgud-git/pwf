import express, { Router } from "express";

// middleware
import {
  IsAuth,
  emailOverlapCheck,
  nicknameOverlapCheck,
} from "../middleware/auth.middleware";

// controller
import {
  checkAuthcodeController,
  current,
  loginControl,
  logoutControl,
  sendAuthcodeController,
} from "../controller/auth.controller";

// validate
import { loginValidate } from "../validation/auth.validate";

const router: Router = express.Router();

// auth 관련 -------------------------------------------------------
router.get("/current", IsAuth, current); // 현재 유저
router.post("/email/overlap", emailOverlapCheck); // 이메일 중복
router.post("/nickname/overlap", nicknameOverlapCheck); // 닉네임

router.post("/login", loginValidate, loginControl); //로그인
router.post("/logout", logoutControl); //로그아웃
// authcode -------------------------------
router.post("/authcode/resend", sendAuthcodeController); // 인증번호 전송
router.post("/authcode/check", checkAuthcodeController);

module.exports = router;
