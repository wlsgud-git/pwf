import { useEffect, useRef, useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";

import { FormSubmit, InputChange } from "../types/event";
import { emailFormValid, passwordFormValid } from "../validation/auth";
import { EmailError, PasswordError } from "../types/auth";
import { createFormData } from "../util/form";
import { auth_service } from "../service/auth.service";
import { AxiosError } from "../error/error";
import { socketConnect } from "../util/socket";
import axios from "axios";

// type
interface LoginInputProps {
  value: string;
  error: boolean;
  error_msg: string;
  show?: boolean;
  active: boolean;
}

interface LoginBtnProps {
  active: boolean;
  loading: boolean;
}

export const Login = () => {
  let navigate = useNavigate();
  const InputInitState = {
    value: "",
    error: false,
    error_msg: "",
    show: false,
    active: false,
  };
  const BtnInitState = { active: false, loading: false };

  let emailRef = useRef<HTMLInputElement | null>(null);
  let passwordRef = useRef<HTMLInputElement | null>(null);

  let [email, setEmail] = useState<LoginInputProps>(InputInitState);
  let [password, setPassword] = useState<LoginInputProps>(InputInitState);
  let [loginBtn, setLoginBtn] = useState<LoginBtnProps>(BtnInitState);

  const loginError = (path: "email" | "password", msg: string) => {
    if (path == "email")
      setEmail((c) => ({ ...c, error: true, error_msg: msg }));
    else setPassword((c) => ({ ...c, error: true, error_msg: msg }));
  };

  const submitLogin = async (e: FormSubmit) => {
    e.preventDefault();

    try {
      await auth_service.login({
        email: email.value,
        password: password.value,
      });
      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status == 429)
        return alert(
          `${err.response.headers["retry-after"]}초후 다시 시도하세요.`
        );
      let { path, msg } = AxiosError(err);
      loginError(path, msg);
    }
  };

  const inputFocus = (type: "email" | "password") => {
    type == "email"
      ? setEmail((c) => ({ ...c, active: true, error: false }))
      : setPassword((c) => ({ ...c, active: true, error: false }));
  };

  const inputBlur = (type: "email" | "password") => {
    let error_state: boolean =
      type == "email"
        ? emailFormValid(email.value) && email.value !== ""
        : passwordFormValid(password.value) && password.value !== "";

    if (type == "email")
      setEmail((c) => ({
        ...c,
        active: false,
        error: error_state,
        error_msg: EmailError.EMAIL_FORM_ERROR,
      }));
    else
      setPassword((c) => ({
        ...c,
        active: false,
        error: error_state,
        error_msg: PasswordError.PASSWORD_FORM_ERROR,
      }));
  };

  useEffect(() => {
    let status = email.value !== "" && password.value !== "";

    setLoginBtn((c) => ({ ...c, active: status }));
  }, [email.value, password.value]);

  return (
    <div className="page login_page">
      <div className="login_pwf_introduce">
        PLAY WITH FRIENDS 친구들과 실시간 화면을 공유해 보세요.
      </div>

      <div className="login_form_container">
        <span className="login_text">로그인</span>

        <form className="login_pwf_form" onSubmit={submitLogin}>
          {/* 이메일 */}
          <div className="login_info_container">
            <div
              className="login_input_box"
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
              className="login_error"
              style={{ display: email.error ? "flex" : "none" }}
            >
              {email.error_msg}
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="login_info_container">
            <div
              className="login_input_box"
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
              className="login_error"
              style={{ display: password.error ? "flex" : "none" }}
            >
              {password.error_msg}
            </div>
          </div>
          {/* 로그인 버튼 */}
          <button
            className="login_btn"
            style={{ opacity: loginBtn.active ? 1 : 0.5 }}
            disabled={!loginBtn.active}
          >
            로그인
          </button>
        </form>

        <div className="login_support_box">
          <Link to="/signup">회원가입</Link>
          <Link to="/password/reset">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
};
