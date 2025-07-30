import * as SBTN from "../../css/global/button.style";
import { StateDispatch } from "../../types/event";
import { UserButtonProps } from "../../types/user";

interface UserBtnProps {
  text: "로그인" | "회원가입";
  button: UserButtonProps;
  //   setButton: StateDispatch<
}

// form안에서 사용할 것
export const UserButtonComponet = ({ text, button }: UserBtnProps) => {
  return (
    <SBTN.UserBtn button={button} disabled={!button.active || button.loading}>
      {button.loading ? "...진행중" : text}
    </SBTN.UserBtn>
  );
};
