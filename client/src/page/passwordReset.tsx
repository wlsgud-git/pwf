import { useEffect, useState } from "react";
import * as SPW from "../css/page/passwordReset.style";
import { FormSubmit, InputChange } from "../types/event";
import { auth_service } from "../service/auth.service";
import { emailValidate } from "../validation/auth";

import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "../error/error";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { modalState } from "../redux/reducer/modalReducer";
import { useSelector } from "react-redux";

export const PasswordReset = () => {
  let dispatch = useDispatch<AppDispatch>();
  let { status, type } = useSelector((state: RootState) => state.modal.auth!);
  let navigate = useNavigate();
  let [email, setEmail] = useState<string>("");
  let [error, setError] = useState<{ state: boolean; msg: string }>({
    state: false,
    msg: "",
  });
  let [loading, setLoading] = useState<boolean>(false);

  const EmailCheck = async (e: FormSubmit) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailValidate(email, true);
      await auth_service.resendAuthcode({ email });
      dispatch(
        modalState({
          active: true,
          type: "authcode",
          email,
          auth: { status: false, type: "password reset" },
        })
      );
    } catch (err) {
      let { path, msg } = AxiosError(err);
      setError((c) => ({ ...c, state: true, msg }));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status && type == "password reset")
      dispatch(
        modalState({
          active: true,
          type: "password",
          auth: { status: false, type: null },
        })
      );
  }, [status, type]);

  const finish = () => navigate("/login");

  return (
    <SPW.PwResetBox>
      {/* icon */}
      <SPW.PwResetIcon>
        <i className="fa-solid fa-lock"></i>
      </SPW.PwResetIcon>

      <SPW.PwResetText>
        비밀번호를 변경하기 위해 이메일 인증을 하세요.
      </SPW.PwResetText>

      <SPW.PwResetEmailForm onSubmit={EmailCheck}>
        <SPW.PwResetEmailBox>
          <SPW.PwResetEmailInput
            type="email"
            spellCheck={false}
            error={error.state}
            value={email}
            placeholder="이메일"
            onFocus={() => setError((c) => ({ ...c, state: false }))}
            onChange={(e: InputChange) => setEmail(e.target.value)}
          />
          <SPW.PwResetErrorBox error={error.state}>
            {error.msg}
          </SPW.PwResetErrorBox>
        </SPW.PwResetEmailBox>

        <SPW.PwResetBtn disabled={loading}>
          {loading ? "...진행중" : "인증하기"}
        </SPW.PwResetBtn>
      </SPW.PwResetEmailForm>

      {/* <div> */}
      <SPW.ReturnLoginBtn to="/login">
        로그인 페이지로 돌아가기
      </SPW.ReturnLoginBtn>
      {/* </div> */}
    </SPW.PwResetBox>
  );
};
