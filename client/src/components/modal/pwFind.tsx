import "../../css/modal/pwFind.css";

import { User } from "../../types/user";

import { emitter } from "../../util/event";
import { FormEvent, useState } from "react";
import { InputChange } from "../../types/event";
import { emailValidate } from "../../validation/auth";
import { user_service } from "../../service/user.service";
import { createFormData } from "../../util/form";

interface PwFindProps {
  show: boolean;
  setshow: any;
  email: string;
  callback?: () => void;
}

interface InputProps {
  error: boolean;
  error_msg: string;
  value: string;
  show?: boolean;
}

export const PwFind = ({ show, setshow, email, callback }: PwFindProps) => {
  let initState = {
    error: false,
    error_msg: "",
    value: "",
    show: false,
  };
  let [password, setPassword] = useState<InputProps>(initState);
  let [passwordCheck, setPasswordCheck] = useState<InputProps>(initState);

  let reset = () => {
    setPassword(initState);
    setPasswordCheck(initState);
    emitter.emit("modal", { type: "pwfind" });
    setshow(false);
  };

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
      let res = await user_service.passwordChange(
        createFormData({ email, password: password.value })
      );

      alert(res.message);
      reset();
      if (callback) callback();
    } catch (err) {
      console.log(err);
    }
  };

  // 비밀번호 확인값 검증
  let passwordCheckValidate = (e: InputChange) => {
    let value = e.target.value;
    let valid = password.value === value;
    setPasswordCheck((c) => ({
      ...c,
      value,
      error: !valid,
      error_msg: valid ? "" : "비밀번호와 값이 일치하지 않습니다",
    }));
  };

  return (
    <div className="pw_find_modal" style={{ display: show ? "flex" : "none" }}>
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <div className="pw_find_box">
        <form className="pw_find_form" onSubmit={submit}>
          {/* password */}
          <div className="pw_find_info_box">
            <div
              className="pw_find_input_box"
              style={{
                border: `1px solid ${password.error ? "red" : "gray"}`,
              }}
            >
              <input
                type={password.show ? "text" : "password"}
                placeholder="새 비밀번호"
                value={password.value}
                onChange={(e: InputChange) =>
                  setPassword((c) => ({ ...c, value: e.target.value }))
                }
                onFocus={() => setPassword((c) => ({ ...c, error: false }))}
                // onBlur={() => passwordValidate(password.value, setPassword)}
              />
              <button
                type="button"
                onClick={() => setPassword((c) => ({ ...c, show: !c.show }))}
              >
                <i
                  className={`fa-solid fa-eye${password.show ? "-slash" : ""}`}
                ></i>
              </button>
            </div>
            <div
              style={{ display: password.error ? "block" : "none" }}
              className="pw_find_error_box"
            >
              {password.error_msg}
            </div>
          </div>
          {/* password check */}
          <div className="pw_find_info_box">
            <div
              className="pw_find_input_box"
              style={{
                border: `1px solid ${passwordCheck.error ? "red" : "gray"}`,
              }}
            >
              <input
                type={passwordCheck.show ? "text" : "password"}
                placeholder="새 비밀번화 확인"
                value={passwordCheck.value}
                onChange={passwordCheckValidate}
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordCheck((c) => ({ ...c, show: !c.show }))
                }
              >
                <i
                  className={`fa-solid fa-eye${
                    passwordCheck.show ? "-slash" : ""
                  }`}
                ></i>
              </button>
            </div>
            <div
              style={{ display: passwordCheck.error ? "block" : "none" }}
              className="pw_find_error_box"
            >
              {passwordCheck.error_msg}
            </div>
          </div>
          <button className="pw_find_btn">변경하기</button>
        </form>
      </div>
    </div>
  );
};
