"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamSchema = void 0;
const zod_1 = require("zod");
exports.StreamSchema = {
    create: zod_1.z.object({
        room_name: zod_1.z
            .string()
            .min(1, { message: "방 이름은 최소 1자 이상입니다" })
            .max(20, { message: "방 이름은 최대 20자 이하입니다" }),
        participants: zod_1.z.array(zod_1.z.number()),
        // let result = await prisma.users.findMany({
        //       where: {
        //         id: {
        //           in: idList,
        //         },
        //       },
        //       select: { id: true },
        //     });
        //     return result.length === idList.length;
    }),
    invite: zod_1.z.object({
        id: zod_1.z.number({ message: "아이디는 숫자형입니다." }),
        inviteList: zod_1.z.array(zod_1.z.number()),
    }),
};
