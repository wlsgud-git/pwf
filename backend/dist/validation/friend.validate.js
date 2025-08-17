"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendSchema = void 0;
const zod_1 = require("zod");
const auth_validate_1 = require("./auth.validate");
exports.FriendSchema = {
    requestFriend: zod_1.z.object({
        receiver: (0, auth_validate_1.nicknameFormValidate)(),
    }),
    requestFriendHandle: zod_1.z.object({
        sender: (0, auth_validate_1.nicknameFormValidate)(),
        response: zod_1.z.boolean({ message: "boolean타입이 아닙니다" }),
    }),
    searchFriends: zod_1.z.object({
        nickname: zod_1.z.string({ message: "닉네임은 문자형만 검색 가능합니다" }),
    }),
};
