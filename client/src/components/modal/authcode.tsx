import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// css
import * as SAU from "../../css/modal/authcode.style";

// service
import { auth_service } from "../../service/auth.service";
import { user_service } from "../../service/user.service";
// util
import { createFormData } from "../../util/form";

// type
import { FormSubmit, InputChange } from "../../types/event";
import { AxiosError } from "../../error/error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { modalState } from "../../redux/reducer/modalReducer";
import { triggerAsyncId } from "async_hooks";

export const Authcode = ({ email }: { email: string }) => {
  let dispatch = useDispatch<AppDispatch>();
  let [authcode, setAuthcode] = useState<string>("");
  let [time, setTime] = useState<number>(180);
  let intervalRef = useRef<any>(null);
  let [loading, setLoading] = useState(false);

  const authcodeCheck = async (e: FormSubmit) => {
    e.preventDefault();

    setLoading(true);

    try {
      await auth_service.checkAuthcode({ email, authcode });
      dispatch(
        modalState({
          active: false,
          type: null,
          auth: { status: true },
        })
      );
    } catch (err) {
      console.log(err);
      let error = AxiosError(err);
    }
    setLoading(false);
  };

  // 코드 재전송
  const resend = async () => {
    try {
      let { message } = await auth_service.resendAuthcode({ email });
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
    spendTime();
  }, []);

  return (
    <>
      <SAU.AuthcodeGlobal />
      <SAU.AuthcodeModal>
        <SAU.AuthcodeContainer>
          {/* 인증코드 아이콘 */}
          <SAU.AuthcodeIcon>
            <i className="fa-solid fa-envelope-open-text"></i>
          </SAU.AuthcodeIcon>
          {/* 유저 이메일 정보와 코드 재전송 */}
          <div>
            <SAU.AuthcodeText>
              {email}로 인증번호가 발송되었습니다.
            </SAU.AuthcodeText>

            <SAU.ResendBtn onClick={resend}>코드 재전송</SAU.ResendBtn>
          </div>
          {/* 인증번호 폼 */}
          <SAU.AuthcodeForm onSubmit={authcodeCheck}>
            <SAU.AuthcodeInputBox>
              <SAU.AuthcodeInput
                type="text"
                value={authcode}
                placeholder="인증번호"
                onChange={(e: InputChange) => setAuthcode(e.target.value)}
              />

              <SAU.AuthcodeTimer>
                {Math.floor(time / 60) < 10
                  ? `0${Math.floor(time / 60)}`
                  : `${Math.floor(time / 60)}`}
                :
                {Math.floor(time % 60) < 10
                  ? `0${Math.floor(time % 60)}`
                  : `${Math.floor(time % 60)}`}
              </SAU.AuthcodeTimer>
            </SAU.AuthcodeInputBox>
            <SAU.AuthcodeBtn disabled={loading}>
              {loading ? "확인중..." : "인증번호 확인"}
            </SAU.AuthcodeBtn>
          </SAU.AuthcodeForm>
        </SAU.AuthcodeContainer>
      </SAU.AuthcodeModal>
    </>
  );
};
