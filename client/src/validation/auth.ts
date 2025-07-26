import { Dispatch } from "react";
import { EmailError, PasswordError, NicknameError } from "../types/auth";
import { user_service } from "../service/user.service";
import { createFormData } from "../util/form";
import { auth_service } from "../service/auth.service";

// 이메일 형태 검증
export const emailFormValid = (email: string) => {
  let result = email
    .toString()
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return !result ? true : false;
};

// 비밀번호 형태 검증
export const passwordFormValid = (password: string) => {
  let result = password
    .trim()
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/);
  return !result ? true : false;
};

// 이메일 검증
export const emailValidate = async (email: string, overlap: boolean) => {
  try {
    if (emailFormValid(email))
      throw { path: "email", msg: EmailError.EMAIL_FORM_ERROR };
    await auth_service.emailOverlap({ email, overlap });

    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// 닉네임 검정
export const nicknameValidate = async (nickname: string) => {
  try {
    if (nickname.length < 2 || nickname.length > 12)
      throw { path: "nickname", msg: NicknameError.NICKNAME_FORM_ERROR };
    await auth_service.nicknameOverlap({ nickname });
    return false;
  } catch (err) {
    throw err;
  }
};
