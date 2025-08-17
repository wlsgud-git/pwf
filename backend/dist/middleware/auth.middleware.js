"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = exports.IsAuth = void 0;
const redis_util_1 = require("../util/redis.util");
const jwt_util_1 = require("../util/jwt.util");
// import { AppError } from "../error/reqeustFriend.error";
// Authentication Or Authorization --------------------------
// 유저 인가
const IsAuth = async (req, res, next) => {
    let session_id = req.cookies["session_id"];
    try {
        let user = await (0, redis_util_1.redisGet)(session_id);
        if (!user)
            throw { status: 401, message: "로그인 필요" };
        req.user = JSON.parse(user);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.IsAuth = IsAuth;
// csrf 검증
const csrfProtection = async (req, res, next) => {
    try {
        let token = req.cookies["csrf_token"];
        let result = await (0, jwt_util_1.verifyJwt)(token);
        if (!result)
            throw new Error("csrf_token 갱신이 필요합니다");
        next();
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
};
exports.csrfProtection = csrfProtection;
