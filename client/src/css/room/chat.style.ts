import styled, { createGlobalStyle } from "styled-components";

export const ChatGlobal = createGlobalStyle`
  :root{
    --menu-chat-input-height: 42px;
  }
`;

export const ChatContainer = styled.div`
  width: var(--pwf-menu-box-width);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// 채팅 리스트
export const ChatLists = styled.ul`
  width: 100%;
  height: calc(100% - var(--menu-chat-input-height));
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow-y: auto;
`;

// 채팅폼
export const ChatForm = styled.form`
  width: 100%;
  border-top: 1px solid var(--pwf-light-gray);
  height: var(--menu-chat-input-height);
  display: flex;
  align-items: center;

  input,
  button {
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--pwf-white);
  }
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 0px 8px;
`;

export const ChatBtn = styled.button`
  width: 40px;
`;

export const ChatLi = styled.div<{ me: boolean }>`
  display: flex;
  margin: 3px 0px;
  align-self: ${(p) => (p.me ? "end" : "start")};
`;

export const ChatUserImgCircle = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  border: 1px solid var(--pwf-light-gray);
`;

export const ChatUserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ChatContentBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const ChatUserNick = styled.span`
  font-size: 13px;
  margin-bottom: 5px;
`;

export const ChatContent = styled.div<{ me: boolean }>`
  padding: 5px 10px;
  text-align: start;
  color: black;
  max-width: 180px;
  border-radius: 10px;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  background-color: ${(p) => (p.me ? "yellow" : "white")};
`;
