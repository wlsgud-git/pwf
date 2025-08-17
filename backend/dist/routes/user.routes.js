"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
// controller
const user_controller_1 = require("../controller/user.controller");
const auth_controller_1 = require("../controller/auth.controller");
// validate
// import { signupUserValidate } from "../validation/auth.validate";
const multer_util_1 = require("../util/multer.util");
const global_validate_1 = require("../validation/global.validate");
const auth_validate_1 = require("../validation/auth.validate");
const auth_service_1 = require("../service/auth.service");
const user_validate_1 = require("../validation/user.validate");
const router = express_1.default.Router();
// 닉네임 변경
router.post("/update/nickname", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(user_validate_1.UserSchema.updateNickname), user_controller_1.UserController.updateNickname);
// 이미지 변경
router.post("/update/profile_img", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, multer_util_1.upload.single("profile_img"), user_controller_1.UserController.updateProfile);
// 유저 삭제
router.delete("/delete/:email", user_controller_1.UserController.deleteUser);
// signup ----------------------------
router.post("/account", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.signup), auth_service_1.AuthService.signup, user_controller_1.UserController.signup);
router.post("/account/user", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.signup), // 정보 검증
auth_service_1.AuthService.signup, auth_controller_1.AuthController.sendAuthCode // 이메일에 인증코드 보냄
); // 회원가입시 유저정보 확인
// password change
router.post("/password_change", (0, global_validate_1.validate)(user_validate_1.UserSchema.passwordChange), user_controller_1.UserController.changePassword);
module.exports = router;
