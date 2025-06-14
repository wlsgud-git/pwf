// css
import "../css/signup.css";
import axios from "axios";

// library
import { useEffect, useRef, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";

// other file
import { createFormData } from "../util/form";
import { user_service } from "../service/user.service";
import { AxiosError } from "../error/error";

// types
import { User } from "../types/user";
import {
  SignupMessage,
  EmailError,
  PasswordError,
  NicknameError,
} from "../types/auth";
import { InputChange, FormSubmit } from "../types/event";
import { auth_service } from "../service/auth.service";
import {
  emailValidate,
  nicknameValidate,
  passwordFormValid,
} from "../validation/auth";

interface SignupInputProps {
  value: string;
  error: boolean;
  error_msg: string;
  show?: boolean;
  active: boolean;
}

interface SignupBtnProps {
  active: boolean;
  loading: boolean;
}

type InputChecker = "email" | "nickname" | "password" | "passwordCheck";

export const Signup = () => {
  const InputInitState = {
    value: "",
    error: false,
    error_msg: "",
    show: false,
    active: false,
  };
  const BtnInitState = { active: false, loading: false };

  let emailRef = useRef<HTMLInputElement | null>(null);
  let nicknameRef = useRef<HTMLInputElement | null>(null);
  let passwordRef = useRef<HTMLInputElement | null>(null);
  let passwordCheckRef = useRef<HTMLInputElement | null>(null);

  let [email, setEmail] = useState<SignupInputProps>(InputInitState);
  let [nickname, setNickname] = useState<SignupInputProps>(InputInitState);
  let [password, setPassword] = useState<SignupInputProps>(InputInitState);
  let [passwordCheck, setPasswordCheck] =
    useState<SignupInputProps>(InputInitState);

  let [signupBtn, setSignupBtn] = useState<SignupBtnProps>(BtnInitState);

  const submitLogin = async (e: FormSubmit) => {
    e.preventDefault();

    console.log("email error", email.error);
    console.log("nickname error", nickname.error);
    console.log("password error", password.error);
    console.log("passwordCheck error", passwordCheck.error);
  };

  const signupError = (path: "email" | "nickname", msg: string) => {
    if (path == "email")
      setEmail((c) => ({
        ...c,
        error: c.value !== "" ? true : false,
        error_msg: msg,
      }));
    else {
      setNickname((c) => ({
        ...c,
        error: c.value !== "" ? true : false,
        error_msg: msg,
      }));
    }
  };

  let inputFocus = (type: InputChecker) => {
    if (type == "email")
      setEmail((c) => ({ ...c, active: true, error: false }));
    else if (type == "nickname")
      setNickname((c) => ({ ...c, active: true, error: false }));
    else if (type == "password")
      setPassword((c) => ({ ...c, active: true, error: false }));
    else setPasswordCheck((c) => ({ ...c, active: true, error: false }));
  };

  let inputBlur = async (type: InputChecker) => {
    try {
      let error_state: boolean = false;
      if (type == "email") {
        setEmail((c) => ({ ...c, active: false }));
        await emailValidate(email.value, false);
      } else if (type == "nickname") {
        setNickname((c) => ({ ...c, active: false }));
        await nicknameValidate(nickname.value);
      } else
        setPassword((c) => ({
          ...c,
          active: false,
          error: passwordFormValid(password.value) && password.value !== "",
          error_msg: PasswordError.PASSWORD_FORM_ERROR,
        }));
    } catch (err) {
      let { path, msg } = AxiosError(err);
      signupError(path, msg);
    }
  };

  useEffect(() => {
    // if()

    setPasswordCheck((c) => ({
      ...c,
      error: password.value !== passwordCheck.value,
      error_msg: PasswordError.PASSWORD_CHECK_ERROR,
    }));
  }, [passwordCheck.value]);

  return (
    <div className="page signup_page">
      <div className="signup_form_container">
        <span className="signup_text">회원가입</span>

        <form className="signup_pwf_form" onSubmit={submitLogin}>
          {/* 이메일 */}
          <div className="signup_info_container">
            <div
              className="signup_input_box"
              style={{ border: `1px solid ${email.error ? "red" : "gray"}` }}
              onFocus={() => inputFocus("email")}
              onBlur={() => inputBlur("email")}
            >
              <p
                style={{
                  top:
                    email.value === "" && email.active == false
                      ? "calc(50% - var(--placeholder-font-size))"
                      : "7%",
                }}
              >
                이메일
              </p>
              <input
                type="text"
                spellCheck="false"
                ref={emailRef}
                value={email.value}
                onChange={(e: InputChange) =>
                  setEmail((c) => ({ ...c, value: e.target.value }))
                }
              />
            </div>

            <div
              className="signup_error"
              style={{ display: email.error ? "flex" : "none" }}
            >
              {email.error_msg}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="signup_info_container">
            <div
              className="signup_input_box"
              style={{ border: `1px solid ${nickname.error ? "red" : "gray"}` }}
              onFocus={() => inputFocus("nickname")}
              onBlur={() => inputBlur("nickname")}
            >
              <p
                style={{
                  top:
                    nickname.value === "" && nickname.active == false
                      ? "calc(50% - var(--placeholder-font-size))"
                      : "7%",
                }}
              >
                닉네임
              </p>
              <input
                type="text"
                spellCheck="false"
                ref={nicknameRef}
                value={nickname.value}
                onChange={(e: InputChange) =>
                  setNickname((c) => ({ ...c, value: e.target.value }))
                }
              />
            </div>

            <div
              className="signup_error"
              style={{ display: nickname.error ? "flex" : "none" }}
            >
              {nickname.error_msg}
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="signup_info_container">
            <div
              className="signup_input_box"
              style={{ border: `1px solid ${password.error ? "red" : "gray"}` }}
              onFocus={() => inputFocus("password")}
              onBlur={() => inputBlur("password")}
            >
              <p
                style={{
                  top:
                    password.value === "" && !password.active
                      ? "calc(50% - var(--placeholder-font-size))"
                      : "7%",
                }}
              >
                비밀번호
              </p>
              <input
                type={password.show ? "text" : "password"}
                value={password.value}
                ref={passwordRef}
                onChange={(e: InputChange) =>
                  setPassword((c) => ({ ...c, value: e.target.value }))
                }
              />
              <span
                onClick={() => setPassword((c) => ({ ...c, show: !c.show }))}
              >
                <i
                  className={`fa-solid fa-eye${password.show ? "" : "-slash"}`}
                ></i>
              </span>
            </div>

            <div
              className="signup_error"
              style={{ display: password.error ? "flex" : "none" }}
            >
              {password.error_msg}
            </div>
          </div>

          {/* 비밀번호 확인*/}
          <div className="signup_info_container">
            <div
              className="signup_input_box"
              style={{
                border: `1px solid ${passwordCheck.error ? "red" : "gray"}`,
              }}
              onFocus={() => inputFocus("passwordCheck")}
              onBlur={() =>
                setPasswordCheck((c) => ({
                  ...c,
                  active: c.value !== "",
                  error: c.value === "" ? false : password.value !== c.value,
                }))
              }
            >
              <p
                style={{
                  top:
                    passwordCheck.value === "" && !passwordCheck.active
                      ? "calc(50% - var(--placeholder-font-size))"
                      : "7%",
                }}
              >
                비밀번호 확인
              </p>
              <input
                type={passwordCheck.show ? "text" : "password"}
                value={passwordCheck.value}
                disabled={password.value == ""}
                ref={passwordCheckRef}
                onChange={(e: InputChange) =>
                  setPasswordCheck((c) => ({ ...c, value: e.target.value }))
                }
              />
              <span
                onClick={() =>
                  setPasswordCheck((c) => ({ ...c, show: !c.show }))
                }
              >
                <i
                  className={`fa-solid fa-eye${
                    passwordCheck.show ? "" : "-slash"
                  }`}
                ></i>
              </span>
            </div>

            <div
              className="signup_error"
              style={{ display: passwordCheck.error ? "flex" : "none" }}
            >
              {passwordCheck.error_msg}
            </div>
          </div>
          {/* 로그인 버튼 */}
          <button
            className="signup_btn"
            style={{
              backgroundColor: `var(--pwf-${
                signupBtn.active ? "blue" : "gray"
              })`,
            }}
            disabled={!signupBtn.active}
          >
            회원가입
          </button>
        </form>

        <div>
          <Link to="/login">로그인</Link>
          <span>비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
};
