import express, { Router } from "express";

// middleware
import { IsAuth, csrfProtection } from "../middleware/auth.middleware";

// controller
import { UserController } from "../controller/user.controller";
import { AuthController } from "../controller/auth.controller";
// validate
// import { signupUserValidate } from "../validation/auth.validate";
import { upload } from "../util/multer.util";
import { validate } from "../validation/global.validate";
import { AuthSchema } from "../validation/auth.validate";

const router: Router = express.Router();

// 닉네임 변경
router.post(
  "/update/nickname",
  IsAuth,
  csrfProtection,
  UserController.updateNickname
);
// 이미지 변경
router.post(
  "/update/profile_img",
  IsAuth,
  csrfProtection,
  upload.single("profile_img"),
  UserController.updateProfile
);
// 유저 삭제
router.delete("/delete/:email", UserController.deleteUser);

// signup ----------------------------
router.post("/account", UserController.signup);

router.post(
  "/account/user",
  validate(AuthSchema.signup), // 정보 검증
  AuthController.sendAuthCode // 이메일에 인증코드 보냄
); // 회원가입시 유저정보 확인

// password change
// router.post("/password_change", passwordChange);

module.exports = router;
