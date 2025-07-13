import { dbPlay } from "../util/database.util";
import { User } from "../types/user.types";
import { Room } from "../types/streamroom.types";

// Authentication OR Authorization ------------------------
// 방 정보 얻기
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

// 방 만들기
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

export const inviteStreamRoom = async (id: number, list: string[]) => {
  try {
    let query = `
    update streamingRoom 
    set participants = ( 
    select array(
      select distinct unnest(participants || $1 )) order by 1 
    )
    where id = $2`;
    let data = [list, id];
    return await dbPlay(query, data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
