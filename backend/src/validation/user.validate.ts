import { z } from "zod";
import {
  nicknameFormValidate,
  emailFormValidate,
  passwordFormValidate,
} from "./auth.validate";
import { PasswordError } from "../types/auth.types";

export const UserSchema = {
  updateNickname: z.object({
    id: z.number({ message: "id는 숫자형이여야 합니다." }),
    nickname: nicknameFormValidate(),
  }),

  passwordChange: z
    .object({
      email: emailFormValidate(),
      password: passwordFormValidate(),
      password_check: passwordFormValidate(),
    })
    .refine((data) => data.password === data.password_check, {
      message: PasswordError.PASSWORD_CHECK_ERROR,
    }),
};
