// util
import { dbPlay } from "../util/database.util";

// type
import { User } from "../types/user.types";
import { prisma } from "../config/db.config";

export const AuthData = {
  async emailOverlap(email: string) {
    return await prisma.users.findUnique({ where: { email } });
  },

  async nicknameOverlap(nickname: string) {
    return await prisma.users.findUnique({ where: { nickname } });
  },
};
