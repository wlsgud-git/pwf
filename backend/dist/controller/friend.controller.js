"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendController = void 0;
const friend_data_1 = require("../data/friend.data");
const friend_event_1 = require("../event/friend.event");
const socket_util_1 = require("../util/socket.util");
exports.FriendController = {
    // 친구요청
    requestFriend: async (req, res, next) => {
        try {
            let io = (0, socket_util_1.getIo)();
            let { receiver } = req.body;
            let result = await friend_data_1.FriendData.requestFriend(receiver, req.user?.nickname);
            if (!result.length)
                throw { status: 400, msg: "이미 친구이거나 친구요청이 존재합니다." };
            io.to(`user:${receiver}`).emit("friend_request", { from: req.user });
            res
                .status(200)
                .json({ msg: `${receiver}에게 친구요청이 전송되었습니다.` });
        }
        catch (err) {
            next(err);
        }
    },
    //   친구요청 응답
    handleRequestFriend: async (req, res, next) => {
        let io = (0, socket_util_1.getIo)();
        let { sender, response } = req.body;
        try {
            let { users_requestfriend_res_nicknameTousers, users_requestfriend_req_nicknameTousers, } = await friend_data_1.FriendData.requestFriendHandle(req.user?.nickname, sender, response);
            let res_user = await users_requestfriend_res_nicknameTousers;
            let req_user = await users_requestfriend_req_nicknameTousers;
            if (response) {
                res_user.online = (0, friend_event_1.getOnlineState)(res_user.nickname);
                io.to(`user:${sender}`).emit("friend_request_handle", res_user);
                req_user.online = (0, friend_event_1.getOnlineState)(req_user.nickname);
            }
            res.status(200).json({
                sender: req_user,
                response,
                msg: `${sender}의 요청을 ${response ? "수락하였습니다." : "거절하였습니다."}`,
            });
        }
        catch (err) {
            next(err);
        }
    },
    //   친구 삭제
    deleteFriend: async (req, res, next) => {
        let { nickname } = req.params;
        try {
            await friend_data_1.FriendData.deleteFriend(nickname, req.user?.nickname);
            (0, friend_event_1.deleteMyFriend)(nickname, req.user?.nickname);
            res.status(200).json({ msg: "친구가 삭제 되었습니다." });
        }
        catch (err) {
            next(err);
        }
    },
    //   친구 검색
    searchFriends: async (req, res, next) => {
        let { nickname } = req.query;
        try {
            let data = await friend_data_1.FriendData.searchMyFriends(nickname, req.user?.nickname);
            res.status(200).json({ data });
        }
        catch (err) {
            next(err);
        }
    },
};
