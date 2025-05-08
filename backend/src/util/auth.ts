import { User } from "../../types/user";
import { redisGet } from "./redis";
import { getIo } from "./socket";

export const onlineUser = async (user: User) => {
  const state: null | string = await redisGet(user.nickname!);
  user.online = state ? true : false;
  return user;
};

export function userOnlineFriend(friends: User[], online: boolean, user: User) {
  let io = getIo();

  if (friends && io)
    friends.map((val) => {
      io.to(`online:${val.nickname}`).emit("online friend", {
        nickname: user.nickname,
        online,
      });
    });
}
