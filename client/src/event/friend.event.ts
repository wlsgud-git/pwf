import { User } from "../types/user";
import { socketClient } from "../util/socket";

export const initFriendSocketEvent = async (user: User) => {
  try {
    // socketClient.on("friend_request", (data) => {
    //   console.log(`${data.from.nickname}로 부터 친구요청이 옴`);
    // });
  } catch (err) {
    console.log(err);
  }
};
