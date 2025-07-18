import { Socket } from "socket.io";
import { User } from "../types/user.types";
import { getIo } from "../util/socket.util";
import { getMyFriends } from "../data/user.data";

// 친구 소켓 이벤트 초기화
export const initFriendSocketEvent = async (user: User) => {
  try {
    await onlineState(user, true);
  } catch (err) {}
};

// 친구요청 받은 유저에게 소켓 이벤트
export const getFriendRequest = (sender_nick: string, receiver: User) =>
  getIo().to(`user:${sender_nick}`).emit("friend_request_handle", receiver);

// 내 온라인/오프라인 상태를 친구들에게 보냄
export const onlineState = async (who: User, state: boolean) => {
  try {
    let my_friends = await getMyFriends(who);
    let friends: User[] = my_friends[0].friends;
    if (!friends) return;
    friends.map((val) => {
      getIo().to(`user:${val.nickname}`).emit("update_friend_online", {
        who,
        online: state,
      });
    });
  } catch (err) {
    throw err;
  }
};

// 유저 온라인 상태 가져오기
export const getOnlineState = (nick: string) =>
  getIo().sockets.adapter.rooms.get(`user:${nick}`) ? true : false;
