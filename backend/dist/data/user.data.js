"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFriends = exports.UserData = void 0;
const database_util_1 = require("../util/database.util");
const db_config_1 = require("../config/db.config");
exports.UserData = {
    // 이메일로 유저 정보 얻기
    async getUserByEmail(email) {
        return await db_config_1.prisma.$queryRaw `select u.*,
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
    async createUser(email, nickname, password) {
        return await db_config_1.prisma.users.create({
            data: { email, nickname, password },
        });
    },
    // 닉네임 변경
    async changeNickname(id, nickname) {
        return await db_config_1.prisma.users.update({
            where: { id },
            data: { nickname },
        });
    },
    // 프로필 이미지 변경
    async changeProfileImg(id, url, key) {
        return await db_config_1.prisma.users.update({
            where: { id },
            data: { profile_img: url, img_key: key },
        });
    },
    // 비밀번호 변경
    async changePassword(email, password) {
        return await db_config_1.prisma.users.update({
            where: { email },
            data: { password },
        });
    },
    // 유저 삭제
    async deleteUser(email) {
        return await db_config_1.prisma.users.delete({
            where: { email },
        });
    },
};
// 내 친구정보 얻기
let getMyFriends = async (user) => {
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
        return (0, database_util_1.dbPlay)(query, data);
    }
    catch (err) {
        throw err;
    }
};
exports.getMyFriends = getMyFriends;
