import { io, Socket } from "socket.io-client";
import { User } from "../types/user";
import { AppDispatch } from "../context/store";
import { insertReceiver, onlineUpdate } from "../context/reducer/userReducer";

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

export const userSocket = (user?: User) => {
  console.log(`hi ${user}`);
  // socketClient.auth = {
  //   user,
  // };
  socketClient.connect();

  // 친구의 온라인 오프라인 상태
  // socket.on("online friend", (data: User) => dispatch(onlineUpdate(data)));

  // // 요청자가 친구추가를 받아줬을때
  // socket.on("receiver data", (receiver: User) => {
  //   dispatch(insertReceiver(receiver));
  // });
};
