import styled, { createGlobalStyle } from "styled-components";

export const DelGlobal = createGlobalStyle`
:root{
    --del-modal-width: 400px;
    --del-modal-height: 100px;
  }
`;

export const DeleteBox = styled.div`
  width: var(--del-modal-width);
  height: var(--del-modal-height);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--pwf-white);
  font-weight: 600;
`;

export const DeleteBtn = styled.button`
  background-color: inherit;
  border: 1px solid var(--pwf-red);
  color: var(--pwf-red);
  font-weight: 600;
  margin-left: 12px;
  padding: 8px 12px;
  border-radius: 12px;

  &:hover {
    text-decoration: underline;
  }
`;
