import { useState } from "react";
import "../css/passwordReset.css";
import { FormSubmit, InputChange } from "../types/event";
import { auth_service } from "../service/auth.service";
import { emailValidate } from "../validation/auth";

import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "../error/error";
import { Authcode } from "../components/modal/authcode";
import { emitter } from "../util/event";
import { createFormData } from "../util/form";
import { PwFind } from "../components/modal/pwFind";

export const PasswordReset = () => {
  let navigate = useNavigate();
  let [email, setEmail] = useState<string>("");
  let [error, setError] = useState<{ state: boolean; msg: string }>({
    state: false,
    msg: "",
  });
  let [loading, setLoading] = useState<boolean>(false);
  let [show, setShow] = useState<boolean>(false);
  let [pwModal, setPwModal] = useState<boolean>(false);

  const EmailCheck = async (e: FormSubmit) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailValidate(email, true);
      await auth_service.resendAuthcode(createFormData({ email }));
      emitter.emit("modal", { open: true, type: "authcode" });
      setShow(true);
    } catch (err) {
      let { path, msg } = AxiosError(err);
      setError((c) => ({ ...c, state: true, msg }));
    }
    setLoading(false);
  };

  const pwChange = () => {
    emitter.emit("modal", { open: true, type: "pwfind" });
    setPwModal(true);
  };

  const finish = () => navigate("/login");

  return (
    <div className="page password_reset_page">
      {/* 인증코드 모달 */}
      <Authcode
        email={email}
        show={show}
        setShow={setShow}
        callback={pwChange}
      />
      {/* 새 비밀번호 모달 */}
      <PwFind
        email={email}
        show={pwModal}
        setshow={setPwModal}
        callback={finish}
      />

      <div className="password_reset_container">
        {/* icon */}
        <span className="password_reset_icon">
          <i className="fa-solid fa-lock"></i>
        </span>

        <span className="password_reset_text">
          비밀번호를 변경하기 위해 이메일 인증을 하세요.
        </span>

        <form className="password_reset_email_form" onSubmit={EmailCheck}>
          <div className="password_reset_email_input_box">
            <input
              type="email"
              spellCheck={false}
              style={{
                border: `1px solid var(--pwf-${error.state ? "red" : "white"})`,
              }}
              className="password_reset_email_input"
              value={email}
              placeholder="이메일"
              onFocus={() => setError((c) => ({ ...c, state: false }))}
              onChange={(e: InputChange) => setEmail(e.target.value)}
            />
            <span
              style={{ display: error.state ? "flex" : "none" }}
              className="password_reset_error"
            >
              {error.msg}
            </span>
          </div>

          <button className="password_reset_btn" disabled={loading}>
            {loading ? "...진행중" : "인증하기"}
          </button>
        </form>

        {/* <div> */}
        <Link to="/login" className="return_login">
          로그인 페이지로 돌아가기
        </Link>
        {/* </div> */}
      </div>
    </div>
  );
};
