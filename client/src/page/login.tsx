import { useRef, useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";

import { FormSubmit, InputChange } from "../types/event";
import { emailFormValid, passwordFormValid } from "../validation/auth";
import { LoginError } from "../types/auth";
import { errorHandling } from "../error/error";
import { user_service } from "../service/userservice";
import { createFormData } from "../util/form";
import { emitter } from "../util/event";

export const Login = () => {
  let navigate = useNavigate();
  let [loading, setLoading] = useState<boolean>(false);
  let emailRef = useRef<HTMLInputElement | null>(null);
  let passwordRef = useRef<HTMLInputElement | null>(null);

  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [loginError, setLoginError] = useState<{ error: boolean; msg: string }>({
    error: false,
    msg: "",
  });
  let [showPw, setShowPw] = useState<boolean>(false);

  // 로그인 에러 핸들
  const loginErrorHandler = (type: string, msg: string) => {
    if (type == "email") emailRef.current?.focus();
    else passwordRef.current?.focus();

    setLoginError((c) => ({ ...c, error: true, msg }));
  };

  // 로그인 정보 보내기
  const loginSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    if (!emailFormValid(email)) {
      loginErrorHandler("email", LoginError.EMAIL);
      return;
    }
    if (!passwordFormValid(password)) {
      loginErrorHandler("password", LoginError.PASSWORD);
      return;
    }

    let formdata = createFormData({ email, password });
    setLoading(true);

    try {
      let { user, msg } = await user_service.sendLoginInfo(formdata);
      alert("로그인 되었습니다.");
      window.location.href = "/";
    } catch (err) {
      let { path, msg } = errorHandling(err);
      loginErrorHandler(path, msg);
    }
    setLoading(false);
  };

  return (
    <div className="page login_page">
      <div className="login_container">
        {/* 로그인 헤더 */}
        <header className="login_header">
          <span>PWF</span>
        </header>
        {/* 로그인 내용 */}
        <div className="login_content">
          {/* 로그인 에러 */}
          <div
            className="login_error_box"
            style={{ display: loginError.error ? "flex" : "none" }}
          >
            {loginError.msg}
          </div>
          {/* 로그인 정보 (폼) */}
          <form action="post" onSubmit={loginSubmit}>
            {/* 이메일 */}
            <div>
              <input
                type="email"
                spellCheck={false}
                placeholder="이메일"
                ref={emailRef}
                value={email}
                onChange={(e: InputChange) => setEmail(e.target.value)}
              />
            </div>
            {/* 비밀번호 */}
            <div className="password_box">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                ref={passwordRef}
                placeholder="비밀번호"
                onChange={(e: InputChange) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                <i className={`fa-solid fa-eye${showPw ? "-slash" : ""}`}></i>
              </button>
            </div>
            <button className="login_btn" disabled={loading}>
              {loading ? "진행중..." : "로그인"}{" "}
            </button>
          </form>
        </div>
        {/* 로그인 풋터 */}
        <footer className="login_footer">
          <Link to="/signup">회원가입</Link>

          <span
            onClick={() =>
              emitter.emit("modal", { type: "password", open: true })
            }
          >
            비밀번호 찾기
          </span>
        </footer>
      </div>
    </div>
  );
};
