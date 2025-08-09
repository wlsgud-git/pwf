import { UserData } from "../data/user.data";
import { deleteMyFriend, getOnlineState } from "../event/friend.event";
import { ControllerProps } from "../types/control.types";
import { User } from "../types/user.types";

import { getIo } from "../util/socket.util";

export const FriendController: ControllerProps = {
  // 친구요청
  requestFriend: async (req, res, next) => {
    let io = getIo();
    let { receiver } = req.body;

    io.to(`user:${receiver}`).emit("friend_request", { from: req.user });

    res.status(200).json({ msg: `${receiver}에게 친구요청이 전송되었습니다.` });
  },

  //   친구요청 응답
  handleRequestFriend: async (req, res, next) => {
    let io = getIo();
    let { sender, response } = req.body;

    try {
      let {
        users_requestfriend_res_nicknameTousers,
        users_requestfriend_req_nicknameTousers,
      } = await UserData.requestFriendHandle(
        req.user?.nickname!,
        sender,
        response
      );

      let res_user: User = await users_requestfriend_res_nicknameTousers;
      let req_user: User = await users_requestfriend_req_nicknameTousers;

      if (response) {
        res_user.online = getOnlineState(res_user.nickname);
        io.to(`user:${sender}`).emit("friend_request_handle", res_user);
        req_user.online = getOnlineState(req_user.nickname);
      }

      res.status(200).json({
        sender: req_user,
        response,
        msg: `${sender}의 요청을 ${
          response ? "수락하였습니다." : "거절하였습니다."
        }`,
      });
    } catch (err) {
      next(err);
    }
  },

  //   친구 삭제
  deleteFriend: async (req, res, next) => {
    let { nickname } = req.params;

    try {
      await UserData.deleteFriend(nickname, req.user?.nickname!);
      deleteMyFriend(nickname, req.user?.nickname!);
      res.status(200).json({ msg: "친구가 삭제 되었습니다." });
    } catch (err) {
      next(err);
    }
  },

  //   친구 검색
  searchFriends: async (req, res, next) => {
    let { nickname } = req.query;
    try {
      let data = await UserData.searchMyFriends(
        nickname as string,
        req.user?.nickname as string
      );
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
};
