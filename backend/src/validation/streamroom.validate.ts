import { z } from "zod";
import { prisma } from "../config/db.config";

export const createRoomSchema = z.object({
  room_name: z
    .string()
    .min(1, { message: "방 이름은 최소 1자 이상입니다" })
    .max(20, { message: "방 이름은 최대 20자 이하입니다" }),
  participants: z.refine(
    async (val) => {
      let idList = val as number[];
      let result = await prisma.users.findMany({
        where: {
          id: {
            in: idList,
          },
        },
        select: { id: true },
      });
      return result.length === idList.length;
    },
    { message: "존재하지 않는 유저가 포함되어 있습니다. 다시 시도해주세요" }
  ),
  // .refine(
  //   async (reciever) => {
  //     console.log("실행되는데?");
  //     const result = await UserData.requestFriend(reciever, nickname);
  //     return result.length;
  //   },
  //   { message: "이미 친구이거나 친구요청이 있습니다." }
  // ),
});
