// util
import { dbPlay } from "../util/database.util";

// type
import { User } from "../types/user.types";

export const emailOverlap = async (email: string) => {
  try {
    let query = `select * from users where email = $1`;
    let data = [email];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};

// 닉네임 중복검사
export const nicknameOverlap = async (nickname: string) => {
  try {
    let query = `select * from users where nickname = $1`;
    let data = [nickname];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};
