import { dbPlay } from "../util/database.util";
import { User } from "../types/user.types";
import { Room } from "../types/streamroom.types";

// Authentication OR Authorization ------------------------
export const getStreamRoomData = async (id: number) => {
  try {
    let query = `
    select str.id, str.room_name, jsonb_agg(distinct to_jsonb(u)) as participants  from streamingRoom str
    left join users u on u.id = any(str.participants)
    where str.id = $1
    group by str.id`;
    let data = [id];
    return await dbPlay<Room>(query, data);
  } catch (err) {
    throw err;
  }
};

// 방 정보 얻기
export const createStreamRoom = async (info: Room) => {
  try {
    let { room_name, participants } = info;
    let query = `insert into StreamingRoom values(default, $1, $2, now()) returning *`;
    let data = [room_name, participants];
    return await dbPlay<Room>(query, data);
  } catch (err) {
    throw err;
  }
};
