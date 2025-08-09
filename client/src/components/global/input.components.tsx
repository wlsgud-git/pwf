import { useEffect, useState } from "react";
import * as SIP from "../../css/global/input.style";
import { UserInputProps } from "../../types/user";
import { InputChange, StateDispatch } from "../../types/event";

import { emailFormValid, passwordFormValid } from "../../validation/auth";
import { EmailError, PasswordError } from "../../types/auth";

type InputAllowType = "email" | "password" | "nickname" | "password_check";

interface InputProps {
  path: InputAllowType;
  input: UserInputProps;
  setInput: StateDispatch<UserInputProps>;
  cb?: () => void;
}

export const UserInputComponent = ({
  path,
  input,
  setInput,
  cb,
}: InputProps) => {
  const inputFocus = () =>
    setInput((c) => ({ ...c, active: true, error: false }));

  return (
    <SIP.UserInputContainer>
      <SIP.UserInputBox input={input} onFocus={inputFocus} onBlur={cb}>
        <SIP.UserInputText input={input}>{path}</SIP.UserInputText>
        <SIP.UserInput
          type={
            (path == "password" || path == "password_check") && !input.show
              ? "password"
              : "text"
          }
          value={input.value}
          onChange={(e: InputChange) =>
            setInput((c) => ({ ...c, value: e.target.value }))
          }
        ></SIP.UserInput>
        {(path == "password" || path == "password_check") && (
          <SIP.PasswordShow
            onClick={() => setInput((c) => ({ ...c, show: !c.show }))}
          >
            <i className={`fa-solid fa-eye${input.show ? "" : "-slash"}`}></i>
          </SIP.PasswordShow>
        )}
      </SIP.UserInputBox>
      <SIP.UserInputError input={input}>{input.error_msg}</SIP.UserInputError>
    </SIP.UserInputContainer>
  );
};
