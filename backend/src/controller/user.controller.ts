// config
import { config } from "../config/env.config";

// util
import { hashingText } from "../util/crypto.util";

// data;
import { UserData } from "../data/user.data";

// types
import { NicknameError, SignupMessage } from "../types/auth.types";
import { s3FileDelete, s3FileUpload } from "../util/aws.util";
import { ControllerProps } from "../types/control.types";
import { prisma } from "../config/db.config";

export const UserController: ControllerProps = {
  signupUserInfoControl: (req, res, next) => {
    res.status(200).json({ message: "success" });
  },
  // 회원가입
  signup: async (req, res, next) => {
    let { email, nickname, password } = req.body;

    try {
      let hash_password = await hashingText(password);
      await UserData.createUser(email, nickname, hash_password);
      res.status(201).json({ message: SignupMessage.SUCCESS });
    } catch (err) {
      next(err);
    }
  },
  // 이미지 변경
  updateProfile: async (req, res, next) => {
    let { id, key } = req.body;
    let newkey = `user/${id}/${new Date().getTime()}/img`;
    try {
      await s3FileDelete({ key, bucket: config.aws.profile_bucket });
      let url = await s3FileUpload({
        key: newkey,
        bucket: config.aws.profile_bucket,
        file: req.file,
      });
      await UserData.changeProfileImg(id, url, newkey);
      res
        .status(200)
        .json({ msg: "이미지가 변경되었습니다.", key: newkey, url });
    } catch (err) {
      next(err);
    }
  },

  // 닉네임 변경
  updateNickname: async (req, res, next) => {
    let { id, nickname } = req.body;
    try {
      let user = await prisma.users.findUnique({ where: { nickname } });
      if (user)
        throw { status: 409, msg: NicknameError.NICKNAME_OVERLAP_ERROR };

      await UserData.changeNickname(id, nickname);
      res.status(200).json({ msg: "닉네임이 변경되었습니다" });
    } catch (err) {
      next(err);
    }
  },
  // 유저 삭제
  deleteUser: async (req, res, next) => {
    let { email } = req.params;
    try {
      await UserData.deleteUser(email);
      res.status(200).json({ message: `${email} 계정이 삭제되었습니다.` });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    let { email, password } = req.body;

    try {
      let hash_password = await hashingText(password);
      await UserData.changePassword(email, hash_password);

      res.status(200).json({ msg: "비밀번호가 변경되었습니다" });
    } catch (err) {
      next(err);
    }
  },
};
