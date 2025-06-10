import "../../css/modal/pwFind.css";

import { User } from "../../types/user";
import { ModalList } from "../../page/modal";

import { emitter } from "../../util/event";
import { FormEvent, useState } from "react";
import { InputChange } from "../../types/event";
import { emailValidate, passwordValidate } from "../../validation/auth";

interface PwFindProps {
  type: ModalList;
}

interface InputProps {
  error: boolean;
  error_msg: string;
  value: string;
  show?: boolean;
}

export const PwFind = ({ type }: PwFindProps) => {
  let initState = {
    error: false,
    error_msg: "",
    value: "",
    show: false,
  };
  let [email, setEmail] = useState<InputProps>(initState);
  let [password, setPassword] = useState<InputProps>(initState);
  let [passwordCheck, setPasswordCheck] = useState<InputProps>(initState);

  let submit = async (e: FormEvent) => {
    e.preventDefault();
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
    <div
      className="pw_find_modal"
      style={{ display: type == "password" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={() => emitter.emit("modal", { type })}>X</button>
      </header>

      <div className="pw_find_box">
        <form className="pw_find_form" onSubmit={submit}>
          {/* email */}
          <div className="pw_find_info_box">
            <div
              className="pw_find_input_box"
              style={{
                border: `1px solid ${email.error ? "red" : "gray"}`,
              }}
            >
              <input
                type="email"
                placeholder="이메일"
                value={email.value}
                spellCheck={false}
                onFocus={() => setEmail((c) => ({ ...c, error: false }))}
                onBlur={() => emailValidate(email.value, setEmail, true)}
                onChange={(e: InputChange) =>
                  setEmail((c) => ({ ...c, value: e.target.value }))
                }
              />
            </div>
            <div
              style={{ display: email.error ? "block" : "none" }}
              className="pw_find_error_box"
            >
              {email.error_msg}
            </div>
          </div>
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
                onBlur={() => passwordValidate(password.value, setPassword)}
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
