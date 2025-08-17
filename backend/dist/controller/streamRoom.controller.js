"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamController = void 0;
const streamRoom_data_1 = require("../data/streamRoom.data");
const livekit_server_sdk_1 = require("livekit-server-sdk");
const stream_event_1 = require("../event/stream.event");
const db_config_1 = require("../config/db.config");
exports.StreamController = {
    // 방 정보 얻기
    getRoom: async (req, res, next) => {
        try {
            let { id } = req.params;
            let room = await (0, streamRoom_data_1.getStreamRoomData)(parseInt(id));
            res.status(200).json({ room: room[0] });
        }
        catch (err) {
            next(err);
        }
    },
    // 방 생성
    createRoom: async (req, res, next) => {
        let { room_name, participants } = req.body;
        try {
            let result = await db_config_1.prisma.users.findMany({
                where: {
                    id: {
                        in: participants,
                    },
                },
                select: { id: true },
            });
            if (result.length !== participants.length)
                throw { status: 400, msg: "맞지 않은 유저가 있습니다." };
            let room = await streamRoom_data_1.StreamRoomData.createStreamRoom(room_name, participants);
            (0, stream_event_1.inviteStreamingRoom)(room[0].participants, room[0]);
            res.status(201).json({ msg: "방 생성이 완료되었습니다.", room: room[0] });
        }
        catch (err) {
            next(err);
        }
    },
    // 방 토큰
    roomAccessToken: async (req, res, next) => {
        try {
            const { room, identity } = req.body;
            let at = new livekit_server_sdk_1.AccessToken("laisndlin", "galsmdlnlblaksldklnalsdmmlalfmlbklmalwmdiqnwknfkoaxclkklasdnml", { identity });
            at.addGrant({ roomJoin: true, room });
            let token = await at.toJwt();
            res.status(200).json({ token });
        }
        catch (err) {
            next(err);
        }
    },
    // 방 친구초대
    inviteRoom: async (req, res, next) => {
        try {
            let { id, inviteList } = req.body;
            let room = (await streamRoom_data_1.StreamRoomData.getStreamRoomData(id));
            if (!room[0])
                throw { status: 400, msg: "존재하지 않는 방입니다." };
            let invite_li = await db_config_1.prisma.users.findMany({
                where: { id: { in: inviteList } },
            });
            if (invite_li.length !== inviteList.length)
                throw {
                    status: 400,
                    msg: "존재하지 않는 유저가 있습니다. 다시 시도해 주세요.",
                };
            let uroom = (await (0, streamRoom_data_1.inviteStreamRoom)(id, inviteList));
            (0, stream_event_1.inviteStreamingRoom)(invite_li, uroom[0]);
            (0, stream_event_1.insertNewUser)(room[0], invite_li);
            res.status(200).json({ msg: "초대가 완료되었습니다." });
        }
        catch (err) {
            next(err);
        }
    },
};
