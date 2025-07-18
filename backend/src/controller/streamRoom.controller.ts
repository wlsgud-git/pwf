import { RequestHandler } from "express";
import {
  createStreamRoom,
  getStreamRoomData,
  inviteStreamRoom,
} from "../data/streamRoom.data";
import { AccessToken, VideoGrant } from "livekit-server-sdk";
import { getIo } from "../util/socket.util";

import { insertNewUser, inviteStreamingRoom } from "../event/stream.event";
import { Room } from "../types/streamroom.types";
import { User } from "../types/user.types";
// 방 정보 얻기
export const getRoom: RequestHandler = async (req, res) => {
  try {
    let { id } = req.params;

    let room = await getStreamRoomData(parseInt(id));
    res.status(200).json({ room: room[0] });
  } catch (err) {
    res.status(400).json(err);
  }
};

// 방 만들기
export const createRoom: RequestHandler = async (req, res) => {
  try {
    let room: Room[] = await createStreamRoom(req.body);

    inviteStreamingRoom(room[0].participants as User[], room[0]);
    res.status(201).json({ msg: "방 생성이 완료되었습니다.", room: room[0] });
  } catch (err) {
    res.status(400).json(err);
  }
};

// livekit 토큰 얻기
export const roomAccessToken: RequestHandler = async (req, res) => {
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
    res.status(400).json(err);
  }
};

// 방에 친구 초대하기
export const inviteRoom: RequestHandler = async (req, res) => {
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
    res.status(400).json(err);
  }
};
