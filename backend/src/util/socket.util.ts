import { Socket, Server } from "socket.io";
import * as mediasoup from "mediasoup";

import { HttpServer, HttpsServer } from "../app";
import { NextFunction } from "express";

// utils

// config
import { config } from "../config/env.config";
// import { initMediasoup, router } from "../config/stream.config";

// types
import { User } from "../types/user.types";
import { initFriendSocketEvent, onlineState } from "../event/friend.event";

let io: any = null;
let socketCors = {
  origin: config.https.client_host,
  methods: ["get", "post"],
  allowedHeaders: ["my-custom-header"],
  credentials: true,
};

export function initSocket() {
  io = new Server(HttpServer, {
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
    console.log("user connected");
    // // 로그인하면 online인걸 친구들한테 보내줘야 함
    socket.join(`user:${user.nickname}`);

    initFriendSocketEvent(user); //친구 이벤트

    socket.on("disconnect", async () => {
      onlineState(user, false);
    });
  });
}

export function getIo() {
  if (!io) throw new Error("socket.io not initial");
  return io;
}
