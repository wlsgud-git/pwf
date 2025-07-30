import styled from "styled-components";
import { UserButtonProps } from "../../types/user";

export const UserBtn = styled.button<{ button: UserButtonProps }>`
  padding: 6px;
  font-weight: 600;
  font-size: 15px;
  border-radius: 7px;
  color: var(--pwf-white);
  border: none;
  outline: none;
  background-color: var(--pwf-blue);
  opacity: ${(p) => (!p.button.active || p.button.loading ? 0.5 : 1)};
  cursor: ${(p) =>
    !p.button.active || p.button.loading ? "not-allowed" : "pointer"};
`;
