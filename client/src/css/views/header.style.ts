import styled, { createGlobalStyle } from "styled-components";

export const HeaderGlobal = createGlobalStyle`
:root{
 --page-header-height: 55px;
 --page-header-user-box-size: 40px;
}
`;
// export const
export const Header = styled.header`
  width: 100%;
  height: var(--page-header-height);
  border-bottom: 0.1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
`;

export const HeaderLogo = styled.span``;

export const HeaderUserBox = styled.div`
  width: var(--page-header-user-box-size);
  height: var(--page-header-user-box-size);
  position: relative;
`;

export const HeaderUserBoxBtn = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid white;
  display: block;
  overflow: hidden;
`;

export const HeaderUserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const HeaderUserControlBox = styled.div<{ show: boolean }>`
  overflow: hidden;
  z-index: 1232;
  background-color: var(--pwf-signiture-color);
  position: absolute;
  width: 120px;
  right: 0;
  flex-direction: column;
  top: calc(var(--page-header-user-box-size) + 10px);
  box-shadow: 1.5px 1.5px 1.5px 1.5px var(--pwf-background-transparent);
  border-radius: 10px;
  overflow: hidden;
  display: ${(p) => (p.show ? "flex" : "none")};
`;

export const HeaderUserControlBtn = styled.button`
  background-color: inherit;
  color: var(--pwf-white);
  font-weight: 600;
  padding: 6px 12px;
  outline: none;
  display: flex;
  border: none;
  font-size: 14px;
  align-items: center;

  i {
    margin-right: 10px;
  }

  &:hover {
    background-color: var(--pwf-background-transparent);
  }
`;
