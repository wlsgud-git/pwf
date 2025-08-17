"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIo = getIo;
const socket_io_1 = require("socket.io");
const app_1 = require("../app");
// utils
// config
const env_config_1 = require("../config/env.config");
const friend_event_1 = require("../event/friend.event");
let io = null;
let socketCors = {
    origin: env_config_1.config.https.host,
    methods: ["get", "post"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
};
function initSocket() {
    io = new socket_io_1.Server(app_1.HttpsServer, {
        cors: socketCors,
    });
    io.use(async (socket, next) => {
        let { user } = socket.handshake.auth;
        try {
            // let result = await redisGet(user.nickname);
            next();
        }
        catch (err) {
            next(err);
        }
    });
    io.on("connect", async (socket) => {
        let { user } = socket.handshake.auth;
        // // 로그인하면 online인걸 친구들한테 보내줘야 함
        socket.join(`user:${user.nickname}`);
        (0, friend_event_1.initFriendSocketEvent)(user); //친구 이벤트
        socket.on("disconnect", async () => {
            (0, friend_event_1.onlineState)(user, false);
        });
    });
}
function getIo() {
    if (!io)
        throw new Error("socket.io not initial");
    return io;
}
