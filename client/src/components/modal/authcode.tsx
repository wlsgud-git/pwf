import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { ModalList } from "../../page/modal";
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

  // 모달 닫을때 해야될 것
  const reset = () => {
    setShow(false);
    setAuthcode("");
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
      setTime(180);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="authcode_modal" style={{ display: show ? "flex" : "none" }}>
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

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
            <span>03 : 00</span>
          </div>
          <button className="authcode_btn">인증번호 확인</button>
        </form>
      </div>
    </div>
  );
};
