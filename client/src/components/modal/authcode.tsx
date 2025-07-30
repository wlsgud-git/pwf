import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// css
import "../../css/modal/authcode.css";

// service
import { auth_service } from "../../service/auth.service";
import { user_service } from "../../service/user.service";
// util
import { createFormData } from "../../util/form";

// type
import { User } from "../../types/user";
import { FormSubmit, InputChange } from "../../types/event";
import { emitter } from "../../util/event";
import { AxiosError } from "../../error/error";

interface AuthcodeProps {
  show: boolean;
  setShow: any;
  email: string;
  callback: () => void;
}

export const Authcode = ({ show, setShow, email, callback }: AuthcodeProps) => {
  let [authcode, setAuthcode] = useState<string>("");
  let [time, setTime] = useState<number>(180);
  let intervalRef = useRef<any>(null);

  // 모달 닫을때 해야될 것
  const reset = () => {
    setShow(false);
    setAuthcode("");
    breakTime();
    setTime(180);
    emitter.emit("modal", { type: "authcode" });
  };

  const authcodeCheck = async (e: FormSubmit) => {
    e.preventDefault();
    try {
      await auth_service.checkAuthcode(createFormData({ email, authcode }));

      reset();
      callback();
    } catch (err) {
      let error = AxiosError(err);
      console.log(error);
    }
  };

  const resend = async () => {
    try {
      let { message } = await auth_service.resendAuthcode(
        createFormData({ email })
      );
      alert(message);
      restartTime();
    } catch (err) {
      console.log(err);
    }
  };

  // authcode 타이머

  function spendTime() {
    // if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime((c) => c - 1);
    }, 1000);
  }

  const restartTime = () => {
    breakTime();
    setTime(180);
    spendTime();
  };

  const breakTime = () => clearInterval(intervalRef.current);

  useEffect(() => {
    if (show) spendTime();
  }, [show]);

  return (
    <div className="authcode_modal" style={{ display: show ? "flex" : "none" }}>
      <div className="authcode_container">
        {/* 인증코드 아이콘 */}
        <span className="authcode_icon">
          <i className="fa-solid fa-envelope-open-text"></i>
        </span>
        {/* 유저 이메일 정보와 코드 재전송 */}
        <div>
          <span className="authcode_text">
            {email}로 인증번호가 발송되었습니다.
          </span>

          <button className="resend_btn" onClick={resend}>
            코드 재전송
          </button>
        </div>
        {/* 인증번호 폼 */}
        <form className="authcode_form" onSubmit={authcodeCheck}>
          <div className="authcode_input_box">
            <input
              type="text"
              value={authcode}
              placeholder="인증번호"
              onChange={(e: InputChange) => setAuthcode(e.target.value)}
            />

            <span className="test">
              {Math.floor(time / 60) < 10
                ? `0${Math.floor(time / 60)}`
                : `${Math.floor(time / 60)}`}
              :
              {Math.floor(time % 60) < 10
                ? `0${Math.floor(time % 60)}`
                : `${Math.floor(time % 60)}`}
            </span>
          </div>
          <button className="authcode_btn">인증번호 확인</button>
        </form>
      </div>
    </div>
  );
};
