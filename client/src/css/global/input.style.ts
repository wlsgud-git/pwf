import styled from "styled-components";
import { UserInputProps } from "../../types/user";

export const UserInputContainer = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  align-items: start;
  width: ${(p) => p.width}px;
`;

export const UserInputBox = styled.div<{ input: UserInputProps }>`
  border: 1px solid var(--pwf-${(p) => (p.input.error ? "red" : "light-gray")});
  border-radius: 7px;
  position: relative;
  width: 100%;
  display: flex;
  cursor: pointer;
  color: var(--pwf-white);
  align-items: center;
`;

export const UserInputText = styled.p<{ input: UserInputProps }>`
  transition: all 0.3s ease;
  font-size: var(--placeholder-font-size);
  position: absolute;
  left: var(--input-placeholder-left);
  margin-bottom: 5px;
  top: ${(props) =>
    props.input.value === "" && !props.input.active
      ? "calc(50% - var(--placeholder-font-size))"
      : "7%"};
`;

export const UserInput = styled.input`
  flex: 1;
  padding: 20px 7px 7px var(--input-placeholder-left);
  font-weight: 600;
  border: none;
  color: var(--pwf-white);
  background-color: inherit;

  &focus {
    border-color: red;
  }
`;

export const PasswordShow = styled.span`
  z-index: 12352;
  margin-right: 8px;
  font-size: 14px;
`;

export const UserInputError = styled.div<{ input: UserInputProps }>`
  font-size: 13px;
  margin-top: 3px;
  font-weight: 600;
  transition: all 0.3s ease;
  color: var(--pwf-red);
  display: ${(props) => (props.input.error ? "flex" : "none")};
`;
