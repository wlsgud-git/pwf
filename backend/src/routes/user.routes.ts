import express, { Router } from "express";

// middleware
import { IsAuth, csrfProtection } from "../middleware/auth.middleware";

// controller
import {
  accountUser,
  handleRequestFriend,
  requestFriendWithNickname,
  passwordChange,
  deleteController,
  updateNickname,
  updateProfileImg,
} from "../controller/user.controller";

// validate
import { signupUserValidate } from "../validation/auth.validate";
import { sendAuthcodeController } from "../controller/auth.controller";
import { upload } from "../util/multer.util";

const router: Router = express.Router();

// user 관련 -------------------------------------------------
// 닉네임 변경
router.post("/update/nickname", IsAuth, csrfProtection, updateNickname);
// 이미지 변경
router.post(
  "/update/profile_img",
  IsAuth,
  csrfProtection,
  upload.single("profile_img"),
  updateProfileImg
);
// 유저 삭제
router.delete("/delete/:email", deleteController);

// signup ----------------------------
router.post("/account", accountUser);

router.post(
  "/account/user",
  signupUserValidate, // 정보 검증
  sendAuthcodeController // 이메일에 인증코드 보냄
); // 회원가입시 유저정보 확인

// requestFriend ------------------------
//친구요청 전송
router.post(
  "/request/friend",
  IsAuth,
  csrfProtection,
  requestFriendWithNickname
);
//친구요청 수락/거절
router.post(
  "/request/friend/response",
  IsAuth,
  csrfProtection,
  handleRequestFriend
);

// password change
router.post("/password_change", passwordChange);

module.exports = router;
