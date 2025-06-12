import { Dispatch } from "react";
import { EmailError, PasswordError, NicknameError } from "../types/auth";
import { user_service } from "../service/userservice";
import { createFormData } from "../util/form";
import { errorHandling } from "../error/error";

import { SignupInputProps } from "../types/auth";
import { StateDispatch } from "../types/event";

// 이메일 형태 검증
export const emailFormValid = (email: string) => {
  let result = email
    .toString()
    .trim()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return !result ? false : true;
};

// 비밀번호 형태 검증
export const passwordFormValid = (password: string) => {
  let result = password
    .trim()
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!*?&])[A-Za-z\d@$!%*?&]{8,20}$/);
  return !result ? false : true;
};

// 이메일 검증
export const emailValidate = async (
  email: string,
  set_email: StateDispatch<SignupInputProps>,
  overlap: boolean
) => {
  try {
    if (!emailFormValid(email))
      throw { type: "email", msg: EmailError.EMAIL_FORM_ERROR };
    let formdata = createFormData({ email });
    let res = await user_service.emailOverlap(formdata);

    if (overlap) {
      if (typeof res == "string")
        throw { type: "email", msg: "존재하지 않는 이메일입니다." };
    } else {
      if (typeof res == "object")
        throw { type: "email", msg: "이미 존재하는 이메일입니다." };
    }
    set_email((c) => ({ ...c, error: false }));
  } catch (err) {
    let { type, msg } = errorHandling(err);
    set_email((c) => ({ ...c, error: true, error_msg: msg }));
  }
};

// 닉네임 검증
export const nicknameValidate = async (
  nickname: string,
  set_nickname: StateDispatch<SignupInputProps>
) => {
  try {
    let formdata = createFormData({ nickname });
    let res = await user_service.nicknameOverlap(formdata);
    set_nickname((c) => ({ ...c, error: false }));
  } catch (err) {
    let { type, msg } = errorHandling(err);
    set_nickname((c) => ({ ...c, error: true, error_msg: msg }));
  }
};

// 비밀번호 인가
export const passwordValidate = (
  password: string,
  set_password: StateDispatch<SignupInputProps>
) => {
  let result = passwordFormValid(password);
  if (!result)
    set_password((c) => ({
      ...c,
      error: !result ? true : false,
      error_msg: !result ? PasswordError.PASSWORD_FORM_ERROR : "",
    }));
};
