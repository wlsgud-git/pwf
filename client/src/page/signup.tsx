// css

// library
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// other file
import { user_service } from "../service/user.service";
import { AxiosError } from "../error/error";

// types
import { PasswordError } from "../types/auth";
import { FormSubmit } from "../types/event";
import {
  emailValidate,
  nicknameValidate,
  passwordFormValid,
} from "../validation/auth";
import { UserInputComponent } from "../components/global/input.components";
import { useSetSignup, useSignup } from "../context/signup.context";

import * as S from "../css/page/login.style";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { modalState } from "../redux/reducer/modalReducer";
import { UserButtonComponet } from "../components/global/button.component";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";

type InputChecker = "email" | "nickname" | "password" | "passwordCheck";

export const Signup = () => {
  let { status, type } = useSelector((state: RootState) => state.modal.auth!);
  let { email, nickname, password, passwordCheck, authBtn } = useSignup();
  let { setEmail, setNickname, setPassword, setPasswordCheck, setAuthBtn } =
    useSetSignup();
  let navigate = useNavigate();

  let dispatch = useDispatch<AppDispatch>();

  // 에러 컨트롤
  const signupError = (path: InputChecker, msg: string) => {
    if (path == "email")
      setEmail((c) => ({
        ...c,
        error: true,
        error_msg: msg,
      }));
    else if (path == "nickname")
      setNickname((c) => ({
        ...c,
        error: true,
        error_msg: msg,
      }));
    else if (path == "password")
      setPassword((c) => ({
        ...c,
        error: true,
        error_msg: PasswordError.PASSWORD_FORM_ERROR,
      }));
    else
      setPasswordCheck((c) => ({
        ...c,
        error: true,
        error_msg: PasswordError.PASSWORD_CHECK_ERROR,
      }));
  };

  // 회원가입
  const account = async () => {
    try {
      await user_service.account({
        email: email.value,
        nickname: nickname.value,
        password: password.value,
        password_check: passwordCheck.value,
      });
      dispatch(
        modalState({
          active: false,
          type: null,
          auth: { status: false, type: null },
        })
      );
      alert("회원가입이 완료되었습니다");
      window.location.href = "/login";
    } catch (err) {
      alert(err);
    }
  };

  const submitSignup = async (e: FormSubmit) => {
    e.preventDefault();
    setAuthBtn((c) => ({ ...c, loading: true }));

    try {
      await user_service.accountUser({
        email: email.value,
        nickname: nickname.value,
        password: password.value,
        password_check: passwordCheck.value,
      });

      dispatch(
        modalState({
          active: true,
          type: "authcode",
          email: email.value,
          auth: { status: false, type: "signup" },
        })
      );
    } catch (err) {
      let { path, msg } = AxiosError(err);
      signupError(path, msg);
    }
    setAuthBtn((c) => ({ ...c, loading: false }));
  };

  let inputBlur = async (type: InputChecker) => {
    try {
      if (type == "email") {
        setEmail((c) => ({ ...c, active: false }));
        await emailValidate(email.value, false);
      } else if (type == "nickname") {
        setNickname((c) => ({ ...c, active: false }));
        await nicknameValidate(nickname.value);
      } else if (type == "password") {
        setPassword((c) => ({ ...c, active: false }));
        if (passwordFormValid(password.value))
          throw { path: "password", msg: PasswordError.PASSWORD_FORM_ERROR };
      } else {
        setPasswordCheck((c) => ({ ...c, active: false }));
        if (password.value !== passwordCheck.value) {
          throw {
            path: "passwordCheck",
            msg: PasswordError.PASSWORD_CHECK_ERROR,
          };
        }
      }
    } catch (err) {
      let { path, msg } = AxiosError(err);
      signupError(path, msg);
    }
  };

  // 값이 변할때 회원가입 버튼 활성화
  useEffect(() => {
    let check =
      email.value !== "" &&
      !email.error &&
      nickname.value !== "" &&
      !nickname.error &&
      password.value !== "" &&
      !password.error &&
      passwordCheck.value !== "" &&
      passwordCheck.value === password.value;
    setAuthBtn((c) => ({
      ...c,
      active: check,
    }));
  }, [email.value, nickname.value, password.value, passwordCheck.value]);

  useEffect(() => {
    if (status && type == "signup") account();
  }, [status]);

  return (
    <S.LoginPage>
      <S.LoginContentContainer>
        <S.LoginText>회원가입</S.LoginText>

        <S.LoginForm onSubmit={submitSignup}>
          {/* 이메일 */}
          <UserInputComponent
            path="email"
            input={email}
            setInput={setEmail}
            cb={() => inputBlur("email")}
          />

          {/* 닉네임 */}
          <UserInputComponent
            path="nickname"
            input={nickname}
            setInput={setNickname}
            cb={() => inputBlur("nickname")}
          />

          {/* 비밀번호 */}
          <UserInputComponent
            path="password"
            input={password}
            setInput={setPassword}
            cb={() => inputBlur("password")}
          />

          {/* 비밀번호 확인*/}
          <UserInputComponent
            path="password_check"
            input={passwordCheck}
            setInput={setPasswordCheck}
            cb={() => inputBlur("passwordCheck")}
          />

          {/* 회원가입 버튼 */}
          <UserButtonComponet text="회원가입" button={authBtn} />
        </S.LoginForm>

        <S.LoginSuppporBox>
          <span>계정이 있다면?</span>
          <Link to={"/login"}>로그인</Link>
        </S.LoginSuppporBox>
      </S.LoginContentContainer>
    </S.LoginPage>
  );
};
