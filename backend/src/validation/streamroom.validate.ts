import { z } from "zod";
import { prisma } from "../config/db.config";

export const StreamSchema = {
  create: z.object({
    room_name: z
      .string()
      .min(1, { message: "방 이름은 최소 1자 이상입니다" })
      .max(20, { message: "방 이름은 최대 20자 이하입니다" }),
    participants: z.array(z.number()),
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

  invite: z.object({
    id: z.number({ message: "아이디는 숫자형입니다." }),
    inviteList: z.array(z.number()),
  }),
};
