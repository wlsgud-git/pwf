"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNewUser = exports.inviteStreamingRoom = void 0;
const socket_util_1 = require("../util/socket.util");
const inviteStreamingRoom = (list, room) => {
    let io = (0, socket_util_1.getIo)();
    list.map((val) => io.to(`user:${val.nickname}`).emit("invite room", room));
};
exports.inviteStreamingRoom = inviteStreamingRoom;
const insertNewUser = (room, new_users) => {
    let io = (0, socket_util_1.getIo)();
    let participants = room.participants;
    participants.map((val) => io
        .to(`user:${val.nickname}`)
        .emit("insert user", { id: room.id, new_users }));
};
exports.insertNewUser = insertNewUser;
