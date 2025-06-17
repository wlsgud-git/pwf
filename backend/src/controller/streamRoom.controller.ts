import { RequestHandler } from "express";
import { createStreamRoom, getStreamRoomData } from "../data/streamRoom.data";

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
    res.status(201).json({ msg: "방 생성이 완료되었습니다.", room });
  } catch (err) {
    res.status(400).json(err);
  }
};
