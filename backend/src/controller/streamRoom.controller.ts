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
      let result = await prisma.users.findMany({
        where: {
          id: {
            in: participants,
          },
        },
        select: { id: true },
      });

      if (result.length !== participants.length)
        throw { status: 400, msg: "맞지 않은 유저가 있습니다." };

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
      let { id, inviteList } = req.body;

      let room = (await StreamRoomData.getStreamRoomData(id)) as Room[];
      if (!room[0]) throw { status: 400, msg: "존재하지 않는 방입니다." };

      let invite_li = await prisma.users.findMany({
        where: { id: { in: inviteList } },
      });

      if (invite_li.length !== inviteList.length)
        throw {
          status: 400,
          msg: "존재하지 않는 유저가 있습니다. 다시 시도해 주세요.",
        };

      let uroom = (await inviteStreamRoom(id, inviteList)) as Room[];

      inviteStreamingRoom(invite_li, uroom[0]);
      insertNewUser(room[0], invite_li);

      res.status(200).json({ msg: "초대가 완료되었습니다." });
    } catch (err) {
      next(err);
    }
  },
};
