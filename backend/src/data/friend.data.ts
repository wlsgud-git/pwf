import { prisma } from "../config/db.config";

export const FriendData = {
  // 친구요청
  async requestFriend(receiver: string, sender: string) {
    return await prisma.$queryRaw<{ result: boolean }[]>`
        insert into requestFriend (res_nickname, req_nickname, state)
        select ${receiver}, ${sender}, false
        where not exists ( 
        select 1 from requestFriend re
        where (re.res_nickname = ${receiver} and re.req_nickname = ${sender}) 
        or (re.res_nickname = ${sender} and req_nickname = ${receiver}) 
    ) returning true as result`;
  },
  //   친구요청 응답
  async requestFriendHandle(receiver: string, sender: string, state: boolean) {
    try {
      if (state) {
        return await prisma.requestfriend.update({
          where: {
            res_nickname_req_nickname: {
              res_nickname: receiver,
              req_nickname: sender,
            },
          },
          data: {
            state,
          },
          select: {
            users_requestfriend_res_nicknameTousers: {
              select: { id: true, nickname: true, profile_img: true },
            },
            users_requestfriend_req_nicknameTousers: {
              select: { id: true, nickname: true, profile_img: true },
            },
            state: true,
          },
        });
      } else {
        return await prisma.requestfriend.delete({
          where: {
            res_nickname_req_nickname: {
              res_nickname: receiver,
              req_nickname: sender,
            },
          },
          select: {
            users_requestfriend_res_nicknameTousers: {
              select: { id: true, nickname: true, profile_img: true },
            },
            users_requestfriend_req_nicknameTousers: {
              select: { id: true, nickname: true, profile_img: true },
            },
          },
        });
      }
    } catch (err) {
      throw { status: 400, msg: "다시 시도해 주세요" };
    }
  },
  //   친구 삭제
  async deleteFriend(nick1: string, nick2: string) {
    try {
      return await prisma.requestfriend.deleteMany({
        where: {
          AND: [
            { state: true },
            {
              OR: [
                { res_nickname: nick1, req_nickname: nick2 },
                { res_nickname: nick2, req_nickname: nick1 },
              ],
            },
          ],
        },
      });
    } catch (err) {
      throw { status: 400, msg: "다시 시도해주세요." };
    }
  },

  //   친구 검색
  async searchMyFriends(nickname: string, my_nick: string) {
    try {
      return await prisma.$queryRaw`
        with ff as (
          select * from requestFriend ref 
          where (
              ref.res_nickname = ${my_nick} or 
              ref.req_nickname = ${my_nick}) and 
        state = true
        )
        select u.nickname, u.profile_img, u.id from ff
        join users u on (
          case 
            when ff.res_nickname = ${my_nick} then u.nickname = ff.req_nickname
            when ff.req_nickname = ${my_nick} then u.nickname = ff.res_nickname
          end 
        )
        where u.nickname like ${`%${nickname}%`}
        `;
    } catch (err) {
      throw err;
    }
  },
};
