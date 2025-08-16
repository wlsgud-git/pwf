// util
import { dbPlay } from "../util/database.util";

// type
import { User } from "../types/user.types";
import { prisma } from "../config/db.config";
import { EmailError, NicknameError } from "../types/auth.types";

export const AuthData = {
  // 이메일 -----
  async emailOverlap(email: string) {
    try {
      let user = await prisma.users.findUnique({ where: { email } });
      if (user)
        throw {
          status: 409,
          path: "email",
          msg: EmailError.EMAIL_OVERLAP_ERROR,
        };
      return;
    } catch (err) {
      throw err;
    }
  },

  async emailExist(email: string) {
    try {
      let user = await prisma.users.findUnique({ where: { email } });
      if (user)
        throw {
          status: 401,
          path: "email",
          msg: EmailError.EMAIL_UNDEFINED_ERROR,
        };
      return;
    } catch (err) {
      throw err;
    }
  },
  // 닉네임 ------
  async nicknameOverlap(nickname: string) {
    try {
      let user = await prisma.users.findUnique({ where: { nickname } });
      if (user)
        throw {
          status: 409,
          path: "nickname",
          msg: NicknameError.NICKNAME_OVERLAP_ERROR,
        };
      return;
    } catch (err) {
      throw err;
    }
  },
};
