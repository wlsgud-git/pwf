import { z } from "zod";
import { prisma } from "../config/db.config";
import { UserData } from "../data/user.data";
import { ControllerProps } from "../types/control.types";
import { User } from "../types/user.types";
import { nicknameFormValidate } from "./auth.validate";

export const FriendSchema = {
  requestFriend: z.object({
    receiver: nicknameFormValidate(),
  }),
  requestFriendHandle: z.object({
    sender: nicknameFormValidate(),
    response: z.boolean({ message: "boolean타입이 아닙니다" }),
  }),
  searchFriends: z.object({
    nickname: z.string({ message: "닉네임은 문자형만 검색 가능합니다" }),
  }),
};
