import { dbPlay } from "../util/database.util";
import { User } from "../types/user.types";

// 유저 정보 얻기 (email)
export const getUserByEmail = async (email: string) => {
  try {
    let query = `
    select u.*,
(
    select json_agg(distinct str_data)
	from (
		select str.id, str.room_name, jsonb_agg(distinct to_jsonb(sru)) as participants from streamingRoom str
		join users sru on sru.id = any(str.participants)
		group by str.id
	) str_data
) as stream_room
, (
    select json_agg(distinct rf_data)
	from (
		select ru.id, ru.nickname, ru.email, ru.profile_img from requestFriend rf
		join users ru on ru.nickname = rf.req_nickname
		where rf.state = false and rf.res_nickname = u.nickname
	) rf_data
) as request_friends
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
		where ff.state = true and (ff.res_nickname = u.nickname or ff.req_nickname = u.nickname)
	) f_data
) as friends
from users u
-- left join streamingRoom str on u.id = any(str.participants)
where u.email = $1
group by u.id`;
    let data = [email];
    return await dbPlay<User>(query, data);
  } catch (err) {
    throw err;
  }
};

export let getMyFriends = async (user: User) => {
  try {
    let query = `
    select (
    select json_agg(distinct f_data)
	from (
		select fu.id, fu.nickname, fu.email, fu.profile_img 
		from requestFriend ff
		join users fu on
		case 
		  when ff.res_nickname = u.nickname then ff.req_nickname = fu.nickname
		  else ff.res_nickname = fu.nickname
		end
		where ff.state = true and (ff.res_nickname = u.nickname or ff.req_nickname = u.nickname)
	) f_data
) as friends
from users u
where u.id = $1
group by u.id`;
    let data = [user.id];
    return dbPlay<any>(query, data);
  } catch (err) {
    throw err;
  }
};

// requestFriend -----------------------------
// 친구요청
export const requestFriend = async (
  res_nickname: string,
  req_nickname: string
) => {
  try {
    let query = `insert into requestFriend (res_nickname, req_nickname, state)
select $1, $2, false
where not exists ( 
	select 1 from requestFriend re
	where (re.res_nickname = $3 and re.req_nickname = $4) 
	or (re.res_nickname = $5 and req_nickname = $6) 
) returning *`;
    let data = [
      res_nickname,
      req_nickname,
      res_nickname,
      req_nickname,
      req_nickname,
      res_nickname,
    ];
    return await dbPlay<null>(query, data);
  } catch (err) {
    throw err;
  }
};

// 친구요청 수락 / 거절
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

// signup -----------------------------------
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

export const deleteUser = async (email: string) => {
  try {
    let query = `delete from users where email = $1`;
    let data = [email];
    return await dbPlay<any>(query, data);
  } catch (err) {
    throw err;
  }
};

// password change
export const changePassword = async (email: string, password: string) => {
  try {
    let query = `update users set password = $1 where email = $2`;
    let data = [password, email];
    return await dbPlay<any>(query, data);
  } catch (err) {
    throw err;
  }
};
