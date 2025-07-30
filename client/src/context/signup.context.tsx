import React, {
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
  Dispatch,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";

import { UserButtonProps, UserInputProps } from "../types/user";
import { StateDispatch } from "../types/event";

interface SignupContext {
  email: UserInputProps;
  nickname: UserInputProps;
  password: UserInputProps;
  passwordCheck: UserInputProps;
  authBtn: UserButtonProps;
}

interface SetSignupContext {
  setEmail: Dispatch<SetStateAction<UserInputProps>>;
  setPassword: Dispatch<SetStateAction<UserInputProps>>;
  setNickname: Dispatch<SetStateAction<UserInputProps>>;
  setPasswordCheck: Dispatch<SetStateAction<UserInputProps>>;
  setAuthBtn: Dispatch<SetStateAction<UserButtonProps>>;
}

const InputInitState = {
  value: "",
  show: false,
  error: false,
  error_msg: "",
  active: false,
};

const BtnInitState: UserButtonProps = {
  active: false,
  loading: false,
};

export let SignupContext = createContext<SignupContext | null>(null);
export let SetSignupContext = createContext<SetSignupContext | null>(null);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<UserInputProps>(InputInitState);
  const [nickname, setNickname] = useState<UserInputProps>(InputInitState);
  const [password, setPassword] = useState<UserInputProps>(InputInitState);
  const [passwordCheck, setPasswordCheck] =
    useState<UserInputProps>(InputInitState);

  const [authBtn, setAuthBtn] = useState<UserButtonProps>(BtnInitState);

  let value = useMemo(
    () => ({ email, nickname, password, passwordCheck, authBtn }),
    [email, nickname, password, passwordCheck, authBtn]
  );

  let setvalue = useMemo(
    () => ({
      setEmail,
      setNickname,
      setPassword,
      setPasswordCheck,
      setAuthBtn,
    }),
    []
  );

  return (
    <SignupContext.Provider value={value}>
      <SetSignupContext.Provider value={setvalue}>
        {children}
      </SetSignupContext.Provider>
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const ctx = useContextSelector(SignupContext, (ctx) => ctx);
  if (!ctx) throw new Error("value X");
  return ctx;
};

export const useSetSignup = () => {
  const ctx = useContextSelector(SetSignupContext, (ctx) => ctx);
  if (!ctx) throw new Error("value X");
  return ctx;
};
