import express, { Router } from "express";

// middleware
import { IsAuth } from "../middleware/auth.middleware";

// controller
import { AuthController } from "../controller/auth.controller";

import rateLimit from "express-rate-limit";
import { asyncValidate, validate } from "../validation/global.validate";
import { AuthSchema } from "../validation/auth.validate";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.setHeader("Access-Control-Expose-Headers", "Retry-After");
    res.status(429).json({ msg: "너무 많은 시도가 있었다..." });
  },
});

const router: Router = express.Router();

// 현재유저
router.get("/current", IsAuth, AuthController.current);
// 이메일 중복
router.post(
  "/email/overlap",
  asyncValidate(AuthSchema.emailOverlap),
  AuthController.emailOverlap
);
// 닉네임 중복
router.post(
  "/nickname/overlap",
  asyncValidate(AuthSchema.nicknameOverlap),
  AuthController.nicknameOverlap
);
// 로그인
router.post(
  "/login",
  limiter,
  validate(AuthSchema.login),
  AuthController.login
);
// 로그아웃
router.post("/logout", AuthController.logout);
// 인증번호 재전송
router.post("/authcode/resend", AuthController.sendAuthCode);
// 인증번호 확인
router.post("/authcode/check", AuthController.checkAuthCode);

module.exports = router;
