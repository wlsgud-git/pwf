import { Socket, Server } from "socket.io";
import { redisGet } from "./redis";

import { HttpServer } from "../app";
import { config } from "../../config";
import { NextFunction } from "express";

import { User } from "../../types/user";
import { userOnlineFriend } from "./auth";

let io: any = null;

export function initSocket() {
  io = new Server(HttpServer, {
    cors: {
      origin: config.socket.client_url,
      methods: ["get", "post"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next: NextFunction) => {
    let { user } = socket.handshake.auth;
    try {
      let result = await redisGet(user.nickname);
      next();
    } catch (err) {
      throw new Error("unAuthenticated user");
    }
  });

  io.on("connect", async (socket: Socket) => {
    let { user } = socket.handshake.auth;

    // 로그인하면 online인걸 친구들한테 보내줘야 함
    socket.join(`online:${user.nickname}`);
    userOnlineFriend(user.friends, true, user);

    // 로그아웃하면 offline인걸 친구들한테 보내줘야함
    socket.on("disconnect", async () => {
      userOnlineFriend(user.friends, false, user);
    });
  });
}

export function getIo() {
  if (!io) throw new Error("socket.io not initial");
  return io;
}
