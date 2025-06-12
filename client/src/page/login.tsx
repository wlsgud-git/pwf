import { act, useEffect, useRef, useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";

import { FormSubmit, InputChange } from "../types/event";
import { emailFormValid, passwordFormValid } from "../validation/auth";
import { EmailError, PasswordError } from "../types/auth";
import { errorHandling } from "../error/error";
import { user_service } from "../service/userservice";
import { createFormData } from "../util/form";
import { emitter } from "../util/event";

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
  const InputInitState = {
    value: "",
    error: false,
    error_msg: "",
    show: false,
    active: false,
  };
  const BtnInitState = { active: false, loading: false };
  let [email, setEmail] = useState<LoginInputProps>(InputInitState);
  let [password, setPassword] = useState<LoginInputProps>(InputInitState);
  let [loginBtn, setLoginBtn] = useState<LoginBtnProps>(BtnInitState);

  const inputFocus = (type: "email" | "password") => {
    type == "email"
      ? setEmail((c) => ({ ...c, active: true, error: false }))
      : setPassword((c) => ({ ...c, active: true, error: false }));
  };

  const inputBlur = (type: "email" | "password") => {
    let error_state: boolean =
      type == "email"
        ? !emailFormValid(email.value) && email.value !== ""
        : !passwordFormValid(password.value) && password.value !== "";

    if (type == "email") {
      setEmail((c) => ({
        ...c,
        active: false,
        error: error_state,
        error_msg: EmailError.EMAIL_FORM_ERROR,
      }));
    } else {
      setPassword((c) => ({
        ...c,
        active: false,
        error: error_state,
        error_msg: PasswordError.PASSWORD_FORM_ERROR,
      }));
    }
  };

  useEffect(() => {
    let status =
      email.value !== "" &&
      emailFormValid(email.value) &&
      password.value !== "" &&
      passwordFormValid(password.value);

    setLoginBtn((c) => ({ ...c, active: status }));
  }, [email.value, password.value]);

  return (
    <div className="page login_page">
      {/* <div className="login_pwf_introduce"></div>
      <div className="login_info_box">
        <div></div>
      </div> */}
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
          {/* placeholder */}
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
          {/* input */}
          <input
            type={password.show ? "text" : "password"}
            value={password.value}
            onChange={(e: InputChange) =>
              setPassword((c) => ({ ...c, value: e.target.value }))
            }
          />
          {/* showing */}
          <span onClick={() => setPassword((c) => ({ ...c, show: !c.show }))}>
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

      <button
        style={{ color: loginBtn.active ? "blue" : "red" }}
        disabled={!loginBtn.active}
      >
        로그인
      </button>
    </div>
  );
};
