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

interface LoginContext {
  email: UserInputProps;
  password: UserInputProps;
  authBtn: UserButtonProps;
}

interface SetLoginContext {
  setEmail: Dispatch<SetStateAction<UserInputProps>>;
  setPassword: Dispatch<SetStateAction<UserInputProps>>;
  setAuthBtn: Dispatch<SetStateAction<UserButtonProps>>;
}

const InputInitState: UserInputProps = {
  value: "",
  show: false,
  error: false,
  error_msg: "",
  active: false,
};

const ButtonInitState: UserButtonProps = {
  active: false,
  loading: false,
};

export let LoginContext = createContext<LoginContext | null>(null);
export let SetLoginContext = createContext<SetLoginContext | null>(null);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<UserInputProps>(InputInitState);
  const [password, setPassword] = useState<UserInputProps>(InputInitState);
  const [authBtn, setAuthBtn] = useState<UserButtonProps>(ButtonInitState);

  let value = useMemo(
    () => ({ email, password, authBtn }),
    [email, password, authBtn]
  );

  let setvalue = useMemo(
    () => ({
      setEmail,
      setPassword,
      setAuthBtn,
    }),
    []
  );

  return (
    <LoginContext.Provider value={value}>
      <SetLoginContext.Provider value={setvalue}>
        {children}
      </SetLoginContext.Provider>
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const ctx = useContextSelector(LoginContext, (ctx) => ctx);
  if (!ctx) throw new Error("value X");
  return ctx;
};

export const useSetLogin = () => {
  const ctx = useContextSelector(SetLoginContext, (ctx) => ctx);
  if (!ctx) throw new Error("value X");
  return ctx;
};
