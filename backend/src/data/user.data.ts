import { dbPlay } from "../util/database.util";
import { User } from "../types/user.types";

import { prisma } from "../config/db.config";

export const UserData = {
  // 이메일로 유저 정보 얻기
  async getUserByEmail(email: string) {
    return await prisma.$queryRaw<User[]>`select u.*,
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
where u.email = ${email}
group by u.id`;
  },

  // 회원가입
  async createUser(email: string, nickname: string, password: string) {
    return await prisma.users.create({
      data: { email, nickname, password },
    });
  },

  // 닉네임 변경
  async changeNickname(id: number, nickname: string) {
    return await prisma.users.update({
      where: { id },
      data: { nickname },
    });
  },

  // 프로필 이미지 변경
  async changeProfileImg(id: number, url: string, key: string) {
    return await prisma.users.update({
      where: { id },
      data: { profile_img: url, img_key: key },
    });
  },

  // 비밀번호 변경
  async changePassword(email: string, password: string) {
    return await prisma.users.update({
      where: { email },
      data: { password },
    });
  },

  // 유저 삭제
  async deleteUser(email: string) {
    return await prisma.users.delete({
      where: { email },
    });
  },
};

// 내 친구정보 얻기
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
