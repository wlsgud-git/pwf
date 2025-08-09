import styled, { createGlobalStyle } from "styled-components";

export const MenuGlobal = createGlobalStyle`
  :root{
    --pwf-menu-box-width: 468px;
    --pwf-menu-text-height: 50px;
  }
`;

export const MenuBox = styled.div<{ show: boolean }>`
  width: var(--pwf-menu-box-width);
  height: 100%;
  display: ${(p) => (p.show ? "flex" : "none")};
  border-left: 1px solid var(--pwf-light-gray);
  flex-direction: column;
`;

export const MenuTextBox = styled.div`
  width: 100%;
  height: var(--pwf-menu-text-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 8px;
  font-weight: bold;
  color: var(--pwf-white);
  border-bottom: 1px solid var(--pwf-light-gray);
`;

export const MenuCloseBtn = styled.button`
  padding: 6px;
  background-color: transparent;
  border: none;
  outline: none;
  font-weight: bold;
  color: var(--pwf-light-gray);
  font-size: 17px;
`;
