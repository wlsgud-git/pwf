import { RequestHandler } from "express";
import {
  createStreamRoom,
  getStreamRoomData,
  inviteStreamRoom,
} from "../data/streamRoom.data";
import { AccessToken, VideoGrant } from "livekit-server-sdk";

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
    let room = await createStreamRoom(req.body);
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
    let { id, inviteList } = req.body;
    await inviteStreamRoom(id, inviteList);
    res.status(200).json({ msg: "초대가 완료되었습니다." });
  } catch (err) {
    res.status(400).json(err);
  }
};
