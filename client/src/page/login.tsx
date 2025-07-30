import { useEffect, useRef, useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";

import { FormSubmit } from "../types/event";
import { emailFormValid, passwordFormValid } from "../validation/auth";
import { EmailError, PasswordError } from "../types/auth";
import { auth_service } from "../service/auth.service";
import { AxiosError } from "../error/error";
import axios from "axios";

import { UserInputComponent } from "../components/global/input.components";
import { useLogin, useSetLogin } from "../context/login.context";
import { UserButtonComponet } from "../components/global/button.component";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setLoading } from "../redux/reducer/userReducer";
import { userAction } from "../redux/actions/userAction";
import { useSelector } from "react-redux";

// type

export const Login = () => {
  let { email, password, authBtn } = useLogin();
  let { setEmail, setPassword, setAuthBtn } = useSetLogin();

  let navigate = useNavigate();
  let userId = useSelector((state: RootState) => state.user.id);
  let dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userId) navigate("/");
  }, [userId]);

  const loginError = (path: "email" | "password", msg: string) => {
    if (path == "email")
      setEmail((c) => ({ ...c, error: true, error_msg: msg }));
    else setPassword((c) => ({ ...c, error: true, error_msg: msg }));
  };

  const submitLogin = async (e: FormSubmit) => {
    e.preventDefault();

    setAuthBtn((c) => ({ ...c, loading: true }));

    try {
      dispatch(setLoading(true));
      await auth_service.login({
        email: email.value,
        password: password.value,
      });
      dispatch(userAction.getUserAction());
      dispatch(setLoading(false));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status == 429)
        return alert(
          `${err.response.headers["retry-after"]}초후 다시 시도하세요.`
        );
      let { path, msg } = AxiosError(err);
      loginError(path, msg);
    }
    dispatch(setLoading(false));
    setAuthBtn((c) => ({ ...c, loading: false }));
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
    let active = email.value !== "" && password.value !== "";

    setAuthBtn((c) => ({ ...c, active }));
  }, [email, password]);

  return (
    <div className="page login_page">
      <div className="login_pwf_introduce">
        PLAY WITH FRIENDS 친구들과 실시간 화면을 공유해 보세요.
      </div>

      <div className="login_form_container">
        <span className="login_text">로그인</span>

        <form className="login_pwf_form" onSubmit={submitLogin}>
          {/* 이메일 */}
          <UserInputComponent
            path={"email"}
            input={email}
            setInput={setEmail}
            cb={() => inputBlur("email")}
          />

          {/* 비밀번호 */}
          <UserInputComponent
            path={"password"}
            input={password}
            setInput={setPassword}
            cb={() => inputBlur("password")}
          />

          {/* 로그인 버튼 */}
          <UserButtonComponet text="로그인" button={authBtn} />
        </form>

        <div className="login_support_box">
          <Link to="/signup">회원가입</Link>
          <Link to="/password/reset">비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
};
