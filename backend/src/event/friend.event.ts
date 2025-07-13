import { Socket } from "socket.io";
import { User } from "../types/user.types";
import { getIo } from "../util/socket.util";

// 친구 소켓 이벤트 초기화
export const initFriendSocketEvent = async (socket: Socket, user: User) => {
  let io = getIo();
  console.log("in friendSocket event:", user.nickname);
  try {
    // socket.to(`${user.nickname}`).on("friend_request", (from: User) => {
    //   console.log(`${user.nickname}에게 ${from.nickname} 친구 요청이 옴`);
    // });
  } catch (err) {}
};

// // 유저 온라인/오프라인 상태확인
// export const onlineUser = async (user: User) => {
//   const state: null | string = await redisGet(user.nickname!);
//   user.online = state ? true : false;
//   return user;
// };

// // 온라인/오프라인시 친구들한테 알리기
// export function userOnlineFriend(friends: User[], online: boolean, user: User) {
//   let io = getIo();

//   if (friends && io)
//     friends.map((val) => {
//       io.to(`online:${val.nickname}`).emit("online friend", {
//         nickname: user.nickname,
//         online,
//       });
//     });
// }
