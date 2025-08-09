import { RequestHandler } from "express";
import {
  createStreamRoom,
  getStreamRoomData,
  inviteStreamRoom,
  StreamRoomData,
} from "../data/streamRoom.data";
import { AccessToken, VideoGrant } from "livekit-server-sdk";
import { getIo } from "../util/socket.util";

import { insertNewUser, inviteStreamingRoom } from "../event/stream.event";
import { Room } from "../types/streamroom.types";
import { User } from "../types/user.types";
import { prisma } from "../config/db.config";
import { createRoomSchema } from "../validation/streamroom.validate";
import { ControllerProps } from "../types/control.types";

export const StreamController: ControllerProps = {
  // 방 정보 얻기
  getRoom: async (req, res, next) => {
    try {
      let { id } = req.params;

      let room = await getStreamRoomData(parseInt(id));
      res.status(200).json({ room: room[0] });
    } catch (err) {
      next(err);
    }
  },

  // 방 생성
  createRoom: async (req, res, next) => {
    let { room_name, participants } = req.body;
    try {
      let result = await createRoomSchema.safeParseAsync(req.body);

      if (!result.success) {
        let errorField = result.error.issues[0];
        throw {
          status: 400,
          msg: errorField.message,
        };
      }
      let room: Room[] = await StreamRoomData.createStreamRoom(
        room_name,
        participants
      );

      inviteStreamingRoom(room[0].participants as User[], room[0]);
      res.status(201).json({ msg: "방 생성이 완료되었습니다.", room: room[0] });
    } catch (err) {
      next(err);
    }
  },

  // 방 토큰
  roomAccessToken: async (req, res, next) => {
    try {
      const { room, identity } = req.body;
      let at = new AccessToken(
        "laisndlin",
        "galsmdlnlblaksldklnalsdmmlalfmlbklmalwmdiqnwknfkoaxclkklasdnml",
        { identity }
      );
      at.addGrant({ roomJoin: true, room });
      let token = await at.toJwt();
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },

  // 방 친구초대
  inviteRoom: async (req, res, next) => {
    try {
      let { room, inviteList } = req.body;
      room = JSON.parse(room);
      inviteList = inviteList.map((val: any) => JSON.parse(val));

      let uroom = (await inviteStreamRoom(
        room.id,
        inviteList.map((val: User) => val.id)
      )) as Room[];

      inviteStreamingRoom(inviteList, uroom[0]);
      insertNewUser(room, inviteList);

      res.status(200).json({ msg: "초대가 완료되었습니다." });
    } catch (err) {
      next(err);
    }
  },
};
