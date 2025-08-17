"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlineState = exports.deleteMyFriend = exports.onlineState = exports.getFriendRequest = exports.initFriendSocketEvent = void 0;
const socket_util_1 = require("../util/socket.util");
const user_data_1 = require("../data/user.data");
// 친구 소켓 이벤트 초기화
const initFriendSocketEvent = async (user) => {
    try {
        await (0, exports.onlineState)(user, true);
    }
    catch (err) { }
};
exports.initFriendSocketEvent = initFriendSocketEvent;
// 친구요청 받은 유저에게 소켓 이벤트
const getFriendRequest = (sender_nick, receiver) => (0, socket_util_1.getIo)().to(`user:${sender_nick}`).emit("friend_request_handle", receiver);
exports.getFriendRequest = getFriendRequest;
// 내 온라인/오프라인 상태를 친구들에게 보냄
const onlineState = async (who, state) => {
    try {
        let my_friends = await (0, user_data_1.getMyFriends)(who);
        let friends = my_friends[0].friends;
        if (!friends)
            return;
        friends.map((val) => {
            (0, socket_util_1.getIo)().to(`user:${val.nickname}`).emit("update_friend_online", {
                who,
                online: state,
            });
        });
    }
    catch (err) {
        throw err;
    }
};
exports.onlineState = onlineState;
const deleteMyFriend = (nick1, nick2) => {
    let io = (0, socket_util_1.getIo)();
    console.log("여기도 왔당께", nick1, nick2);
    io.to(`user:${nick1}`).emit("delete friend", nick2);
    io.to(`user:${nick2}`).emit("delete friend", nick1);
};
exports.deleteMyFriend = deleteMyFriend;
// 유저 온라인 상태 가져오기
const getOnlineState = (nick) => (0, socket_util_1.getIo)().sockets.adapter.rooms.get(`user:${nick}`) ? true : false;
exports.getOnlineState = getOnlineState;
