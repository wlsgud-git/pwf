import { Link } from "react-router-dom";
import styled from "styled-components";

export const PwResetBox = styled.div`
  padding: 30px 20px 20px 20px;
  border: 1px solid var(--pwf-light-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const PwResetIcon = styled.span`
  font-size: 70px;
  color: var(--pwf-white);
  width: 120px;
  height: 120px;
  border: 3px solid var(--pwf-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PwResetEmailForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 20px;
`;

export const PwResetEmailBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 20px;
`;

export const PwResetText = styled.span`
  font-size: 17px;
  color: var(--pwf-white);
  margin: 15px 0px;
`;

export const PwResetEmailInput = styled.input<{ error: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--pwf-${(p) => (p.error ? "red" : "gray")});
  background-color: inherit;
  outline: none;
  color: var(--pwf-white);
`;

// 이메일 에러박스
export const PwResetErrorBox = styled.span<{ error: boolean }>`
  margin-top: 4px;
  font-size: 13px;
  color: var(--pwf-red);
`;

export const PwResetBtn = styled.button`
  width: 100%;
  padding: 8px;
  background-color: var(--pwf-blue);
  color: var(--pwf-white);
  border: none;
  outline: none;
  font-weight: bold;
  font-size: 17px;
  border-radius: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ReturnLoginBtn = styled(Link)`
  color: var(--pwf-white);

  &:hover {
    text-decoration: underline;
  }
`;
