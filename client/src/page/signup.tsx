// css
import "../css/signup.css";
import axios from "axios";

// library
import { Ref, use, useRef, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";

// other file
import { createFormData } from "../util/form";
import { user_service } from "../service/userservice";
import { errorHandling } from "../error/error";

// types
import { User } from "../types/user";
import {
  authErrorProps,
  PasswordError,
  SignupInputProps,
  SignupMessage,
} from "../types/auth";
import { InputChange, FormSubmit } from "../types/event";
import {
  emailValidate,
  nicknameValidate,
  passwordValidate,
} from "../validation/auth";

export const Signup = () => {
  let [loading, setLoading] = useState<boolean>(false);
  let navigate = useNavigate();
  const initialState: SignupInputProps = {
    error: false,
    error_msg: "",
    value: "",
    show: false,
  };
  let [SignupStep, setSignupStep] = useState<boolean>(false);

  let emailRef = useRef<HTMLInputElement | null>(null);
  let nicknameRef = useRef<HTMLInputElement | null>(null);
  let passwordRef = useRef<HTMLInputElement | null>(null);
  let passwordCheckRef = useRef<HTMLInputElement | null>(null);

  let [email, setEmail] = useState<SignupInputProps>(initialState);
  let [nickname, setNickname] = useState<SignupInputProps>(initialState);
  let [password, setPassword] = useState<SignupInputProps>(initialState);
  let [password_check, setPasswordCheck] =
    useState<SignupInputProps>(initialState);

  // 인증부분
  let [authcode, setAuthcode] = useState<string>("");
  let [authError, setAuthError] = useState<{ error: boolean; msg: string }>({
    error: false,
    msg: "",
  });
  let AuthInputRef = useRef<HTMLInputElement | null>(null);

  // 회원가입 버튼 활성화
  const buttonActive = () => {
    if (
      email.value == "" ||
      email.error ||
      nickname.value == "" ||
      nickname.error ||
      password.value == "" ||
      password.error ||
      password_check.value == "" ||
      password_check.error
    )
      return false;
    return true;
  };

  // 유저 정보 보내기
  const submitUserInfo = async (e: FormSubmit) => {
    e.preventDefault();

    let formdata = createFormData({
      email: email.value,
      nickname: nickname.value,
      password: password.value,
      password_check: password_check.value,
    });
    setLoading(true);

    try {
      await user_service.sendUserInfo(formdata);
      setSignupStep((c) => !c);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  // 비밀번화 확인값 검증
  const passwordCheckValid = (e: InputChange) => {
    let value = e.target.value;
    let valid = password.value === value;
    setPasswordCheck((c) => ({
      ...c,
      value,
      error: !valid,
      error_msg: valid ? "" : PasswordError.PASSWORD_CHECK_ERROR,
    }));
  };

  // step 2 -----------------------------------
  // 인증번호 재전송
  const resendAuthcode = async () => {
    let formdata = createFormData({ email: email.value });

    try {
      await user_service.resendAuthcode(formdata);
      setAuthError((c) => ({ ...c, error: false }));
      alert("인증번호를 재전송하였습니다.");
    } catch (err) {
      alert(err);
    }
  };

  // 돌아가기 버튼 클릭시
  const returnStep = () => {
    setAuthError((c) => ({ ...c, error: false }));
    setAuthcode("");
    setSignupStep((c) => !c);
  };

  // 인증번호 확인 후 회원가입
  const authcodeCheck = async (e: FormSubmit) => {
    e.preventDefault();

    let formdata = createFormData({
      email: email.value,
      nickname: nickname.value,
      password: password.value,
      authcode,
    });

    try {
      let res = await user_service.account(formdata);
      alert(SignupMessage.SUCCESS);
      navigate("/login");
    } catch (err) {
      let { msg } = errorHandling(err);
      setAuthError((c) => ({ ...c, error: true, msg }));
    }
  };

  return (
    <div className="page signup_page">
      {SignupStep ? (
        // 회원가입 이메일 인증
        <div className="signup_auth_box">
          {/* header section */}
          <div className="signup_auth_header">
            {email.value}로 인증번호가 전송되었습니다
            <button className="signup_auth_resend_btn" onClick={resendAuthcode}>
              번호 재전송
            </button>
          </div>
          {/* content section */}
          <div className="signup_auth_content">
            {/* error section */}
            <div
              className="auth_error_box"
              style={{ display: authError.error ? "flex" : "none" }}
            >
              {authError.msg}
            </div>
            <form method="post" onSubmit={authcodeCheck}>
              <input
                type="text"
                ref={AuthInputRef}
                value={authcode}
                onFocus={() => setAuthError((c) => ({ ...c, error: false }))}
                placeholder="인증번호를 입력하세요"
                onChange={(e: InputChange) => setAuthcode(e.target.value)}
              />

              <button className="">인증하기</button>
            </form>
          </div>
          <footer className="signup_auth_footer">
            <button onClick={returnStep}>돌아가기</button>
          </footer>
        </div>
      ) : (
        // 회원가입 유저정보
        <div className="signup_container">
          {/* 로그인 헤더 */}
          <div className="signup_header">
            <span>PWF</span>
          </div>

          {/* 로그인 내용 */}
          <div className="signup_content">
            <form action="post" onSubmit={submitUserInfo}>
              {/* 이메일 */}
              <div className="signup_input_box">
                <div
                  style={{
                    border: `1px solid var(--pwf-${
                      email.error ? "red" : "gray"
                    })`,
                  }}
                >
                  <input
                    type="email"
                    onFocus={() => setEmail((c) => ({ ...c, error: false }))}
                    spellCheck={false}
                    placeholder="이메일"
                    ref={emailRef}
                    value={email.value}
                    onBlur={() => emailValidate(email.value, setEmail, false)}
                    onChange={(e: InputChange) =>
                      setEmail((c) => ({ ...c, value: e.target.value }))
                    }
                  />
                </div>

                <span
                  className="signup_error"
                  style={{ display: email.error ? "block" : "none" }}
                >
                  {email.error_msg}
                </span>
              </div>
              {/* 닉네임 */}
              <div className="signup_input_box">
                <div
                  style={{
                    border: `1px solid var(--pwf-${
                      nickname.error ? "red" : "gray"
                    })`,
                  }}
                >
                  <input
                    type="text"
                    placeholder="닉네임"
                    onFocus={() => setNickname((c) => ({ ...c, error: false }))}
                    ref={nicknameRef}
                    spellCheck={false}
                    value={nickname.value}
                    onBlur={() => nicknameValidate(nickname.value, setNickname)}
                    onChange={(e: InputChange) =>
                      setNickname((c) => ({ ...c, value: e.target.value }))
                    }
                  />
                </div>

                <span
                  className="signup_error"
                  style={{ display: nickname.error ? "block" : "none" }}
                >
                  {nickname.error_msg}
                </span>
              </div>
              {/* 비밀번호 */}
              <div className="signup_input_box">
                <div
                  style={{
                    border: `1px solid var(--pwf-${
                      password.error ? "red" : "gray"
                    })`,
                  }}
                >
                  <input
                    type={password.show ? "text" : "password"}
                    className="signup_password_input"
                    placeholder="비밀번호"
                    ref={passwordRef}
                    value={password.value}
                    onFocus={() => setPassword((c) => ({ ...c, error: false }))}
                    onBlur={() => passwordValidate(password.value, setPassword)}
                    onChange={(e: InputChange) =>
                      setPassword((c) => ({ ...c, value: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="pw_show_btn"
                    onClick={() =>
                      setPassword((c) => ({ ...c, show: !c.show }))
                    }
                  >
                    <i
                      className={`fa-solid fa-eye${
                        password.show ? "-slash" : ""
                      }`}
                    ></i>
                  </button>
                </div>

                <span
                  className="signup_error"
                  style={{ display: password.error ? "block" : "none" }}
                >
                  {password.error_msg}
                </span>
              </div>
              {/* 비밀번호 확인 */}
              <div className="signup_input_box">
                <div
                  style={{
                    border: `1px solid var(--pwf-${
                      password_check.error ? "red" : "gray"
                    })`,
                    backgroundColor: password.value === "" ? "" : "",
                  }}
                >
                  <input
                    type={password_check.show ? "text" : "password"}
                    className="signup_password_input"
                    placeholder="비밀번호 확인"
                    ref={passwordCheckRef}
                    value={password.value !== "" ? password_check.value : ""}
                    disabled={password.value === "" ? true : false}
                    onChange={passwordCheckValid}
                  />
                  <button
                    type="button"
                    className="pw_show_btn"
                    onClick={() =>
                      setPasswordCheck((c) => ({ ...c, show: !c.show }))
                    }
                  >
                    <i
                      className={`fa-solid fa-eye${
                        password_check.show ? "-slash" : ""
                      }`}
                    ></i>
                  </button>
                </div>

                <span
                  className="signup_error"
                  style={{ display: password_check.error ? "block" : "none" }}
                >
                  {password_check.error_msg}
                </span>
              </div>

              <button
                style={{ cursor: buttonActive() ? "pointer" : "not-allowed" }}
                disabled={buttonActive() && !loading ? false : true}
                className="signup_btn"
              >
                {loading ? "진행중..." : "회원가입"}
              </button>
            </form>
          </div>

          {/* 로그인 풋터 */}
          <div className="signup_footer">
            <span>계정이 있다면?</span>
            <Link to="/login" className="login_anchor">
              로그인
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
