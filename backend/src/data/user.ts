import { dbPlay } from "../util/database";
import { User } from "../../types/user";

// 이메일 또는 닉네임 중복검사
export const overlapCheck = async (type: string, info: string) => {
  try {
    let query = `select * from users where ${type} = $1`;
    let data = [info];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};

// 친구요청
export const requestFriend = async (
  res_nickname: string,
  req_nickname: string,
  state: boolean
) => {
  try {
    let query = `insert into requestFriend values($1, $2, $3)`;
    let data = [res_nickname, req_nickname, state];
    return await dbPlay<null>(query, data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const requestFriendhandle = async (
  receiver: string,
  sender: string,
  response: boolean
) => {
  try {
    let query = `${
      response
        ? "update requestFriend set state = true"
        : "delete from requestFriend"
    } where res_nickname = $1 and req_nickname = $2`;
    let data = [receiver, sender];
    return await dbPlay<boolean>(query, data);
  } catch (err) {
    throw err;
  }
};

// 유저 정보 얻기 (email)
export const getUserByEmail = async (email: string) => {
  try {
    let query = `select u.*
, (
    select json_agg(distinct rf_data)
	from (
		select ru.id, ru.nickname, ru.email, ru.profile_img from requestFriend rf
		join users ru on ru.nickname = rf.req_nickname
		where rf.state = false and rf.res_nickname = u.nickname
	) rf_data
) as request_friend_list
, (
    select json_agg(distinct f_data)
	from (
		select fu.id, fu.nickname, fu.email, fu.profile_img 
		from requestFriend ff
		join users fu on
		case 
		  when ff.res_nickname = u.nickname then ff.req_nickname = fu.nickname
		  else ff.res_nickname = fu.nickname
		end
		where ff.state = true and ff.res_nickname = u.nickname or ff.req_nickname = u.nickname
	) f_data
) as friends
from users u
where u.email = $1`;
    let data = [email];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};
// 회원가입
export const createUser = async (info: User) => {
  let { email, nickname, password } = info;
  try {
    let query = `insert into users values(default, $1, default, $2,  $3, now())`;
    let data = [nickname, email, password];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};
export const updateUser = async () => {};
export const deleteUser = async () => {};
