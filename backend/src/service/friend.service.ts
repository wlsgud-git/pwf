import { prisma } from "../config/db.config";
import { ControllerProps } from "../types/control.types";

export const FriendService: ControllerProps = {
  requestFriend: async (req, res, next) => {
    try {
      let { receiver } = req.body;

      // 본인에게 친구요청
      if (req.user?.nickname === receiver)
        throw { status: 400, msg: "본인에게 친구요청을 보낼 수 없습니다" };

      const have = await prisma.users.findUnique({
        where: { nickname: receiver },
      });

      if (!have) throw { status: 400, msg: "존재하지 않은 닉네임입니다" };
      next();
    } catch (err) {
      next(err);
    }
  },
  requestFriendHandle: async (req, res, next) => {
    let { sender, response } = req.body;
    try {
      const have = await prisma.users.findUnique({
        where: { nickname: sender },
      });

      if (!have) throw { status: 400, msg: "존재하지 않은 닉네임입니다" };

      const exist = await prisma.requestfriend.findUnique({
        where: {
          res_nickname_req_nickname: {
            res_nickname: req.user?.nickname as string,
            req_nickname: sender,
          },
        },
      });

      if (!exist) throw { status: 400, msg: "친구요청이 존재하지 않습니다" };
      next();
    } catch (err) {
      next(err);
    }
  },
};
