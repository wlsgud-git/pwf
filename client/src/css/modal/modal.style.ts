import styled from "styled-components";

export const ModalBackground = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: ${(p) => (p.active ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  /* background-color: red; */
  background-color: var(--pwf-background-transparent);
  z-index: 123417;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--pwf-signiture-color);
`;

export const ModalContentHeader = styled.header`
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--pwf-gray);
  justify-content: flex-end;
  padding: 5px;
  height: var(--modal-hedaer-height);
  line-height: var(--modal-hedaer-height);
`;

export const ModalCloseBtn = styled.button`
  background-color: inherit;
  border: none;
  color: red;
  font-size: 16px;
  font-weight: bold;
`;
