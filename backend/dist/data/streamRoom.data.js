"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteStreamRoom = exports.createStreamRoom = exports.getStreamRoomData = exports.StreamRoomData = void 0;
const database_util_1 = require("../util/database.util");
const db_config_1 = require("../config/db.config");
// Authentication OR Authorization ------------------------
// 방 정보 얻기
exports.StreamRoomData = {
    async getStreamRoomData(id) {
        return await db_config_1.prisma.$queryRaw `
    select str.id, str.room_name, jsonb_agg(distinct to_jsonb(u)) as participants  from streamingRoom str
    left join users u on u.id = any(str.participants)
    where str.id = ${id}
    group by str.id`;
    },
    async createStreamRoom(name, participants) {
        try {
            return await db_config_1.prisma.$queryRaw `
    with inserted as (
	    insert into streamingRoom 
	    (room_name, participants, create_at)
	    select ${name}, ${participants}, now()
	    returning *
    )
    select i.id, i.room_name, json_agg(distinct u.*) as participants
    from inserted i 
    join users u on u.id = any(i.participants)
    group by i.id, i.room_name`;
        }
        catch (err) {
            throw { state: 400, msg: "알 수 없는 오류 다시 시도해 주세요" };
        }
    },
};
const getStreamRoomData = async (id) => {
    try {
        let query = `
    select str.id, str.room_name, jsonb_agg(distinct to_jsonb(u)) as participants  from streamingRoom str
    left join users u on u.id = any(str.participants)
    where str.id = $1
    group by str.id`;
        let data = [id];
        return await (0, database_util_1.dbPlay)(query, data);
    }
    catch (err) {
        throw err;
    }
};
exports.getStreamRoomData = getStreamRoomData;
// 방 만들기
const createStreamRoom = async (info) => {
    try {
        let { room_name, participants } = info;
        let query = `with inserted as (
	insert into streamingRoom 
	(room_name, participants, create_at)
	select $1, $2, now()
	returning *
)
select i.id, i.room_name, json_agg(distinct u.*) as participants
from inserted i 
join users u on u.id = any(i.participants)
group by i.id, i.room_name`;
        let data = [room_name, participants];
        return await (0, database_util_1.dbPlay)(query, data);
    }
    catch (err) {
        throw err;
    }
};
exports.createStreamRoom = createStreamRoom;
const inviteStreamRoom = async (id, list) => {
    try {
        let query = `
    with updateded as (
update streamingRoom 
    set participants = ( 
    select array(
      select distinct unnest(participants || $1 )) order by 1 
    )
    where id = $2
    returning *
)
select up.id, up.room_name, json_agg(distinct u.*) as participants
from updateded up 
join users u on u.id = any(up.participants)
group by up.id, up.room_name`;
        let data = [list, id];
        return await (0, database_util_1.dbPlay)(query, data);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.inviteStreamRoom = inviteStreamRoom;
