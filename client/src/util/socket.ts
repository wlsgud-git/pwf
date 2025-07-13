import { io, Socket } from "socket.io-client";
import { User } from "../types/user";
import { AppDispatch } from "../redux/store";
import { initFriendSocketEvent } from "../event/friend.event";
// import { insertReceiver, onlineUpdate } from "../redux/reducer/userReducer";

export const socketClient: Socket = io(process.env.REACT_APP_BASEURL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  autoConnect: false,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

export const socketConnect = (user: User) => {
  socketClient.auth = {
    user,
  };
  socketClient.connect();

  initFriendSocketEvent(user);
};

// socketClient.on("friend_request", (from) => {
//   console.log(`${from}으로부터 친구요청이 옴`);
// });
