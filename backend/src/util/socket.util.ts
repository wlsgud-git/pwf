import { Socket, Server } from "socket.io";
import * as mediasoup from "mediasoup";

import { HttpsServer } from "../app";
import { NextFunction } from "express";

// utils

// config
import { config } from "../config/env.config";
// import { initMediasoup, router } from "../config/stream.config";

// types
import { User } from "../types/user.types";
import { initFriendSocketEvent } from "../event/friend.event";

let io: any = null;
let socketCors = {
  origin: config.https.host,
  methods: ["get", "post"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

export function initSocket() {
  io = new Server(HttpsServer, {
    cors: socketCors,
  });

  io.use(async (socket: Socket, next: NextFunction) => {
    let { user } = socket.handshake.auth;

    try {
      // let result = await redisGet(user.nickname);
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connect", async (socket: Socket) => {
    let { user } = socket.handshake.auth;
    // // 로그인하면 online인걸 친구들한테 보내줘야 함
    socket.join(`user:${user.nickname}`);

    initFriendSocketEvent(socket, user); //친구 이벤트
    // userOnlineFriend(user.friends, true, user);
    // // 로그아웃하면 offline인걸 친구들한테 보내줘야함
    // socket.on("disconnect", async () => {
    //   setTimeout(async () => {
    //     let onlineState = await redisGet(user.nickname);
    //     if (!onlineState) userOnlineFriend(user.friends, false, user);
    //   }, 2000);
    // });
  });
}

export function getIo() {
  if (!io) throw new Error("socket.io not initial");
  return io;
}
