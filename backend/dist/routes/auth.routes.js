"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
// controller
const auth_controller_1 = require("../controller/auth.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const global_validate_1 = require("../validation/global.validate");
const auth_validate_1 = require("../validation/auth.validate");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.setHeader("Access-Control-Expose-Headers", "Retry-After");
        res.status(429).json({ msg: "너무 많은 시도가 있었다..." });
    },
});
const router = express_1.default.Router();
// 현재유저
router.get("/current", auth_middleware_1.IsAuth, auth_controller_1.AuthController.current);
// 이메일 중복
router.post("/email/overlap", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.email), auth_controller_1.AuthController.emailOverlap);
// 이메일 존재
router.post("/email/define", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.email), auth_controller_1.AuthController.emailDefine);
// 닉네임 중복
router.post("/nickname/overlap", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.nickname), auth_controller_1.AuthController.nicknameOverlap);
// 로그인
router.post("/login", 
// limiter,
// validate(AuthSchema.login),
auth_controller_1.AuthController.login);
// 로그아웃
router.post("/logout", auth_controller_1.AuthController.logout);
// 인증번호 재전송
router.post("/authcode/resend", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.email), auth_controller_1.AuthController.sendAuthCode);
// 인증번호 확인
router.post("/authcode/check", (0, global_validate_1.validate)(auth_validate_1.AuthSchema.checkAuthcode), auth_controller_1.AuthController.checkAuthCode);
module.exports = router;
