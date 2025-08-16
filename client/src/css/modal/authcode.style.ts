import styled, { createGlobalStyle } from "styled-components";

export const AuthcodeGlobal = createGlobalStyle`
  :root{
    --authcode-width: 410px;
    --authcode-input-width : 80%;
  }
`;

export const AuthcodeModal = styled.div`
  display: flex;
  background-color: var(--pwf-signiture-color);
  flex-direction: column;
  border-radius: 8px;
`;

export const AuthcodeContainer = styled.div`
  width: 100%;
  padding: 20px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AuthcodeIcon = styled.span`
  font-size: 80px;
  color: var(--pwf-white);
  margin-bottom: 15px;
`;

export const AuthcodeText = styled.span`
  color: var(--pwf-white);
`;

export const ResendBtn = styled.button`
  margin-left: 7px;
  color: var(--pwf-blue);
  background-color: inherit;
  border: none;
  outline: none;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }
`;

export const AuthcodeForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const AuthcodeInputBox = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  border: 1px solid vaR(--pwf-light-gray);
`;

export const AuthcodeInput = styled.input`
  flex: 1;
  background-color: inherit;
  border: none;
  padding: 12px 8px;
  color: var(--pwf-white);
`;

export const AuthcodeTimer = styled.span`
  margin: 0px 8px;
  font-size: 13px;
  color: var(--pwf-red);
`;

export const AuthcodeBtn = styled.button`
  border-radius: 20px;
  padding: 10px;
  font-size: 16px;
  color: var(--pwf-white);
  border: none;
  outline: none;
  background-color: var(--pwf-blue);
  font-weight: bold;
`;
