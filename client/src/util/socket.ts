import { io, Socket } from "socket.io-client";
import { User, FriendOnlineStatus } from "../types/user";
import { userAction } from "../context/actions/userAction";
import { AppDispatch } from "../context/store";
import { insertReceiver, onlineUpdate } from "../context/reducer/userReducer";

export const socketClient: Socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

export const testing = (socket: Socket, dispatch: AppDispatch) => {
  socket.on("online friend", (data: User) => {
    dispatch(onlineUpdate(data));
  });

  socket.on("receiver data", (receiver: User) => {
    dispatch(insertReceiver(receiver));
  });
};
