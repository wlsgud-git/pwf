import styled, { createGlobalStyle } from "styled-components";

export const LoginGlobal = createGlobalStyle`
  :root{
    --login-introduce-width: 480px;
  }
`;

export const LoginPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const LoginIntroduce = styled.div`
  width: var(--login-introduce-width);
  height: 80%;
  font-family: "Nanum Pen Script", cursive;
  font-weight: 400;
  font-style: normal;
  text-align: center;
  color: var(--pwf-white);
  font-size: 64px;
  line-height: 80%;
  display: flex;
  align-items: center;
  margin-right: 20px;

  @media (max-width: 874px) {
    display: none;
  }
`;

export const LoginContentContainer = styled.div`
  padding: 24px 26px;
  border: 1px solid var(--pwf-light-gray);
  display: flex;
  border-radius: 8px;
  flex-direction: column;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const LoginText = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 21px;
  color: var(--pwf-white);
  margin-bottom: 38px;
`;

export const LoginSuppporBox = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  font-size: 15px;

  span {
    color: var(--pwf-gray);
    margin-right: 4px;
  }

  a {
    color: var(--pwf-gray);
    margin: 0px 4px;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: var(--pwf-blue);
    }
  }
`;
