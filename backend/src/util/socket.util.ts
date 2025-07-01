import { Socket, Server } from "socket.io";
import * as mediasoup from "mediasoup";

import { HttpsServer } from "../app";
import { NextFunction } from "express";

// utils
import { redisGet } from "./redis.util";
import { userOnlineFriend } from "./auth.util";

// config
import { config } from "../config/env.config";
// import { initMediasoup, router } from "../config/stream.config";

// types
import { User } from "../types/user.types";

let io: any = null;

export function initSocket() {
  io = new Server(HttpsServer, {
    cors: {
      origin: config.https.host,
      methods: ["get", "post"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
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
    // let { user } = socket.handshake.auth;
    // console.log(user);
    console.log("user connect");

    // // 로그인하면 online인걸 친구들한테 보내줘야 함
    // socket.join(`online:${user.nickname}`);
    // userOnlineFriend(user.friends, true, user);

    // // 로그아웃하면 offline인걸 친구들한테 보내줘야함
    // socket.on("disconnect", async () => {
    //   setTimeout(async () => {
    //     let onlineState = await redisGet(user.nickname);
    //     if (!onlineState) userOnlineFriend(user.friends, false, user);
    //   }, 2000);
    // });

    // streaming mediasoup
    socket.on("getRtpCapabilities", (text) => console.log(text));

    socket.on("createTransport", async (cb) => {
      // const transport = await createT;
    });
  });
}

export function getIo() {
  if (!io) throw new Error("socket.io not initial");
  return io;
}
