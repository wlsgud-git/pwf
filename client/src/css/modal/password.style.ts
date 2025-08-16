import styled, { createGlobalStyle } from "styled-components";

export const PwGlobal = createGlobalStyle`
  :root{
    --pw-find-width: 330px;
    --pw-find-height: 180px;
  }
`;

export const PwModal = styled.div`
  width: var(--pw-find-width);
  // height: var(--pw-find-height);
  padding: 30px;
  display: flex;
  background-color: var(--pwf-signiture-color);
  flex-direction: column;
`;

export const PwForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PwChangeBtn = styled.button`
  padding: 8px;
  background-color: var(--pwf-blue);
  width: 100%;
  border: none;
  outline: none;
  color: var(--pwf-white);
  font-weight: bold;
  border-radius: 8px;

  &:hover {
    text-decoration: underline;
  }
`;
