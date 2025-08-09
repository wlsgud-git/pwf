import { z } from "zod";
import { prisma } from "../config/db.config";
import { UserData } from "../data/user.data";
import { ControllerProps } from "../types/control.types";

export const FriendSchema = {
  // requestFriend: async (req) => {
  //   let nickname: string = req.user?.nickname!;
  //   return z.object({
  //     receiver: z
  //       .string()
  //       .trim()
  //       .min(2, { message: "닉네임은 2글자 이상입니다" })
  //       .max(12, { message: "닉네임은 12자 이하입니다" })
  //       .superRefine(async (val, ctx) => {
  //         // 본인에게 요청
  //         if (val === nickname) {
  //           ctx.addIssue({
  //             code: z.ZodIssueCode.custom,
  //             message: "본인에게 친구요청을 보낼 수 없습니다",
  //           });
  //           return;
  //         }

  //         // 존재하지 않은 닉네임
  //         const user = await prisma.users.findUnique({
  //           where: { nickname: val },
  //         });
  //         if (!user) {
  //           ctx.addIssue({
  //             code: z.ZodIssueCode.custom,
  //             message: "유저가 존재하지 않습니다",
  //           });
  //           return;
  //         }

  //         const result = await UserData.requestFriend(val, nickname);
  //         if (!result.length) {
  //           ctx.addIssue({
  //             code: z.ZodIssueCode.custom,
  //             message: "이미 친구이거나 친구요청이 존재합니다",
  //           });
  //           return;
  //         }
  //       }),
  //   });
  // },
  // handleRequestFriend:
  searchFriends: z.object({
    nickname: z.string(),
  }),
};

// 친구요청 검사
export const requestFriendSchema = (nickname: string) =>
  z.object({
    receiver: z
      .string()
      .trim()
      .min(2, { message: "닉네임은 2글자 이상입니다" })
      .max(12, { message: "닉네임은 12자 이하입니다" })
      .superRefine(async (val, ctx) => {
        // 본인에게 요청
        if (val === nickname) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "본인에게 친구요청을 보낼 수 없습니다",
          });
          return;
        }

        // 존재하지 않은 닉네임
        const user = await prisma.users.findUnique({
          where: { nickname: val },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "유저가 존재하지 않습니다",
          });
          return;
        }

        const result = await UserData.requestFriend(val, nickname);
        if (!result.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "이미 친구이거나 친구요청이 존재합니다",
          });
          return;
        }
      }),
  });

// 친구요청 응답 검사
export const requestFriendHandleSchema = (nickname: string) =>
  z.object({
    sender: z
      .string()
      .trim()
      .min(2, { message: "닉네임은 2글자 이상입니다" })
      .max(12, { message: "닉네임은 12자 이하입니다" })
      .superRefine(async (val, ctx) => {
        // 존재하지 않은 닉네임
        const user = await prisma.users.findUnique({
          where: { nickname: val },
        });
        if (!user) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "유저가 존재하지 않습니다",
          });
          return;
        }

        const exist = await prisma.requestfriend.findUnique({
          where: {
            res_nickname_req_nickname: {
              res_nickname: nickname,
              req_nickname: val,
            },
          },
        });

        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "친구요청이 존재하지 않습니다",
          });
          return;
        }
      }),
    response: z.boolean({ message: "boolean타입이 아닙니다" }),
  });
