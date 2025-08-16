import { FormEvent, useState } from "react";
import { InputChange } from "../../types/event";
import { user_service } from "../../service/user.service";
import { createFormData } from "../../util/form";
import { UserInputComponent } from "../global/input.components";

import * as SPW from "../../css/modal/password.style";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { modalState } from "../../redux/reducer/modalReducer";

interface InputProps {
  error: boolean;
  error_msg: string;
  value: string;
  show?: boolean;
}

export const PwFind = ({ email }: { email: string }) => {
  let dispatch = useDispatch<AppDispatch>();
  let initState = {
    error: false,
    error_msg: "",
    value: "",
    show: false,
  };
  let [password, setPassword] = useState<InputProps>(initState);
  let [passwordCheck, setPasswordCheck] = useState<InputProps>(initState);
  let [loading, setLoading] = useState<boolean>(false);

  let submit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      password.value == "" ||
      password.error ||
      passwordCheck.value == "" ||
      passwordCheck.error
    ) {
      alert("값을 정확히 입력해야 합니다.");
      return;
    }

    try {
      let res = await user_service.passwordChange({
        email,
        password: password.value,
        password_check: passwordCheck.value,
      });

      alert("비밀번호가 변경되었습니다.");
      dispatch(modalState({ active: false, type: null, email: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  // 비밀번호 확인값 검증

  return (
    <>
      <SPW.PwGlobal />
      <SPW.PwModal>
        <SPW.PwForm onSubmit={submit}>
          {/* password */}
          <UserInputComponent
            path="password"
            input={password}
            setInput={setPassword}
          />

          {/* password check */}
          <UserInputComponent
            path="password_check"
            input={passwordCheck}
            setInput={setPasswordCheck}
          />

          <SPW.PwChangeBtn>변경하기</SPW.PwChangeBtn>
        </SPW.PwForm>
      </SPW.PwModal>
    </>
  );
};
