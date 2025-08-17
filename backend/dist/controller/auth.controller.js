"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// config
const env_config_1 = require("../config/env.config");
// util
const redis_util_1 = require("../util/redis.util");
const jwt_util_1 = require("../util/jwt.util");
// data
const user_data_1 = require("../data/user.data");
// type
const auth_types_1 = require("../types/auth.types");
const crypto_util_1 = require("../util/crypto.util");
const mail_util_1 = require("../util/mail.util");
const friend_event_1 = require("../event/friend.event");
const auth_data_1 = require("../data/auth.data");
const db_config_1 = require("../config/db.config");
// import "../types/express/express";
exports.AuthController = {
    // 현재 유저 정보 가져오기
    current: async (req, res, next) => {
        try {
            if (!req.user)
                throw { status: 401, message: "로그인 필요" };
            // 친구들 온라인 상태확인
            req.user.friends = req.user.friends?.map((val) => {
                return {
                    ...val,
                    online: (0, friend_event_1.getOnlineState)(val.nickname),
                };
            });
            res.status(200).json({ user: req.user });
        }
        catch (err) {
            next(err);
        }
    },
    // 로그인
    login: async (req, res, next) => {
        let { email, password } = req.body;
        console.log(email, password);
        try {
            let response = await user_data_1.UserData.getUserByEmail(email);
            let user = await response[0];
            if (!user)
                throw {
                    status: 404,
                    path: "email",
                    msg: auth_types_1.EmailError.EMAIL_UNDEFINED_ERROR,
                };
            let check_pw = (await user.password);
            let password_result = await (0, crypto_util_1.compareText)(password, check_pw);
            // // 비밀번호가 올바르지 않다면
            if (!password_result)
                throw {
                    status: 400,
                    path: "password",
                    msg: auth_types_1.PasswordError.PASSWORD_UNEQUAL_ERROR,
                };
            // 여기서부턴 로그인 성공후 프로세스
            let sessionId = await (0, crypto_util_1.hashingText)(email);
            delete user["password"];
            // // 로그인이 성공한거임
            await (0, redis_util_1.redisSet)(sessionId, JSON.stringify(user), env_config_1.config.session.session_expire);
            let csrf_token = await (0, jwt_util_1.createJwt)({ email: user.email }, "refresh");
            // // cookie section
            res.cookie("session_id", sessionId, {
                secure: true,
                httpOnly: true,
                sameSite: "lax",
                maxAge: env_config_1.config.session.session_expire * 1000,
                path: "/",
            });
            res.cookie("csrf_token", csrf_token, {
                secure: true,
                httpOnly: true,
                sameSite: "lax",
                maxAge: env_config_1.config.session.session_expire * 1000,
                path: "/",
            });
            res.status(200).json({ msg: auth_types_1.LoginMessage.SUCCESS });
        }
        catch (err) {
            next(err);
        }
    },
    // 로그아웃
    logout: async (req, res, next) => {
        try {
            await (0, redis_util_1.redisDelete)(req.cookies["session_id"]);
            res.clearCookie("session_id");
            res.status(200).json({ msg: "로그아웃 되었습니다." });
        }
        catch (err) {
            next(err);
        }
    },
    // 이메일 중복
    emailOverlap: async (req, res, next) => {
        let { email } = req.body;
        try {
            await auth_data_1.AuthData.emailOverlap(email);
            res.status(200).json({ msg: "이메일 중복없음" });
        }
        catch (err) {
            next(err);
        }
    },
    // 이메일 존재
    emailDefine: async (req, res, next) => {
        let { email } = req.body;
        try {
            let user = await db_config_1.prisma.users.findUnique({ where: { email } });
            if (!user)
                throw { status: 400, msg: auth_types_1.EmailError.EMAIL_UNDEFINED_ERROR };
            return res.status(200).json({ msg: "이메일 존재함" });
        }
        catch (err) {
            next(err);
        }
    },
    // 닉네임 중복
    nicknameOverlap: async (req, res, next) => {
        let { nickname } = req.body;
        try {
            await auth_data_1.AuthData.nicknameOverlap(nickname);
            res.status(200).json({ msg: "닉네임 중복없음" });
        }
        catch (err) {
            next(err);
        }
    },
    // 인증번호 전송
    sendAuthCode: async (req, res, next) => {
        let { email } = req.body;
        try {
            let auth_code = await (0, mail_util_1.sendAuthcodeMail)(email);
            await (0, redis_util_1.redisSet)(email, auth_code, env_config_1.config.authcode.expires);
            res
                .status(200)
                .json({ message: `${email}에 인증번호를 전송하였습니다.` });
        }
        catch (err) {
            next(err);
        }
    },
    // 인증번호 검증
    checkAuthCode: async (req, res, next) => {
        let { email, authcode } = req.body;
        try {
            let code = await (0, redis_util_1.redisGet)(email);
            if (!code)
                throw { status: 410, msg: auth_types_1.AuthcodeError.AUTHCODE_EXPIRE };
            if (code !== authcode)
                throw { status: 400, msg: auth_types_1.AuthcodeError.AUTHCODE_UNEQUAL };
            res.status(200).json({ msg: "인증이 완료되었습니다." });
        }
        catch (err) {
            next(err);
        }
    },
};
