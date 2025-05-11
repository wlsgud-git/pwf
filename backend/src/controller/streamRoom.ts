import { RequestHandler } from "express";
import { createStreamRoom } from "../data/streamRoom";

// export const getRoom;

export const createRoom: RequestHandler = async (req, res) => {
  try {
    let { room_name, participants } = req.body;
    let room = await createStreamRoom(req.body);
    console.log(room);
    res.status(201).json({ msg: "방 생성이 완료되었습니다." });
  } catch (err) {
    res.status(400).json(err);
  }
};
