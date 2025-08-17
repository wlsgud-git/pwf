"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
// config
const env_config_1 = require("../config/env.config");
// util
const crypto_util_1 = require("../util/crypto.util");
// data;
const user_data_1 = require("../data/user.data");
// types
const auth_types_1 = require("../types/auth.types");
const aws_util_1 = require("../util/aws.util");
const db_config_1 = require("../config/db.config");
exports.UserController = {
    signupUserInfoControl: (req, res, next) => {
        res.status(200).json({ message: "success" });
    },
    // 회원가입
    signup: async (req, res, next) => {
        let { email, nickname, password } = req.body;
        try {
            let hash_password = await (0, crypto_util_1.hashingText)(password);
            await user_data_1.UserData.createUser(email, nickname, hash_password);
            res.status(201).json({ message: auth_types_1.SignupMessage.SUCCESS });
        }
        catch (err) {
            next(err);
        }
    },
    // 이미지 변경
    updateProfile: async (req, res, next) => {
        let { id, key } = req.body;
        let newkey = `user/${id}/${new Date().getTime()}/img`;
        try {
            await (0, aws_util_1.s3FileDelete)({ key, bucket: env_config_1.config.aws.profile_bucket });
            let url = await (0, aws_util_1.s3FileUpload)({
                key: newkey,
                bucket: env_config_1.config.aws.profile_bucket,
                file: req.file,
            });
            await user_data_1.UserData.changeProfileImg(id, url, newkey);
            res
                .status(200)
                .json({ msg: "이미지가 변경되었습니다.", key: newkey, url });
        }
        catch (err) {
            next(err);
        }
    },
    // 닉네임 변경
    updateNickname: async (req, res, next) => {
        let { id, nickname } = req.body;
        try {
            let user = await db_config_1.prisma.users.findUnique({ where: { nickname } });
            if (user)
                throw { status: 409, msg: auth_types_1.NicknameError.NICKNAME_OVERLAP_ERROR };
            await user_data_1.UserData.changeNickname(id, nickname);
            res.status(200).json({ msg: "닉네임이 변경되었습니다" });
        }
        catch (err) {
            next(err);
        }
    },
    // 유저 삭제
    deleteUser: async (req, res, next) => {
        let { email } = req.params;
        try {
            await user_data_1.UserData.deleteUser(email);
            res.status(200).json({ message: `${email} 계정이 삭제되었습니다.` });
        }
        catch (err) {
            next(err);
        }
    },
    changePassword: async (req, res, next) => {
        let { email, password } = req.body;
        try {
            let hash_password = await (0, crypto_util_1.hashingText)(password);
            await user_data_1.UserData.changePassword(email, hash_password);
            res.status(200).json({ msg: "비밀번호가 변경되었습니다" });
        }
        catch (err) {
            next(err);
        }
    },
};
