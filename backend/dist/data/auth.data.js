"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthData = void 0;
const db_config_1 = require("../config/db.config");
const auth_types_1 = require("../types/auth.types");
exports.AuthData = {
    // 이메일 -----
    async emailOverlap(email) {
        try {
            let user = await db_config_1.prisma.users.findUnique({ where: { email } });
            if (user)
                throw {
                    status: 409,
                    path: "email",
                    msg: auth_types_1.EmailError.EMAIL_OVERLAP_ERROR,
                };
            return;
        }
        catch (err) {
            throw err;
        }
    },
    async emailExist(email) {
        try {
            let user = await db_config_1.prisma.users.findUnique({ where: { email } });
            if (user)
                throw {
                    status: 401,
                    path: "email",
                    msg: auth_types_1.EmailError.EMAIL_UNDEFINED_ERROR,
                };
            return;
        }
        catch (err) {
            throw err;
        }
    },
    // 닉네임 ------
    async nicknameOverlap(nickname) {
        try {
            let user = await db_config_1.prisma.users.findUnique({ where: { nickname } });
            if (user)
                throw {
                    status: 409,
                    path: "nickname",
                    msg: auth_types_1.NicknameError.NICKNAME_OVERLAP_ERROR,
                };
            return;
        }
        catch (err) {
            throw err;
        }
    },
};
