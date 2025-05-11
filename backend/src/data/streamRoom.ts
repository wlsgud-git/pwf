import { dbPlay } from "../util/database";
import { User } from "../../types/user";
import { Room } from "../../types/streamroom";

// Authentication OR Authorization ------------------------
// 유저 정보 얻기 (email)
// export const getEmail = async (email: string) => {
//   try {
//     let query = ``;
//     let data = [email];
//     return await dbPlay<User>(query, data);
//   } catch (err) {
//     throw err;
//   }
// };

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
