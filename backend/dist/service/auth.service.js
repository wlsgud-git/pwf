"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_data_1 = require("../data/auth.data");
exports.AuthService = {
    signup: async (req, res, next) => {
        let { email, nickname } = req.body;
        try {
            // 이메일
            await auth_data_1.AuthData.emailOverlap(email);
            //   닉네임
            await auth_data_1.AuthData.nicknameOverlap(nickname);
            next();
        }
        catch (err) {
            next(err);
        }
    },
};
