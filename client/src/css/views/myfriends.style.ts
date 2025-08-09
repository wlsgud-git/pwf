import styled, { createGlobalStyle } from "styled-components";

export const MyFriendsGlobal = createGlobalStyle`
  :root {
    --myfriend-width: 350px;

    // support
    --myfriend-support-box-height: 40px;
    --myfriend-support-btn-size: 35px;
    
    // li
    --myfriend-li-height: 45px;
    --myfriend-li-mini-size: 72px;
    --myfriend-profile-img-size: 30px;
    --myfriend-online-circle-size: 10px;
  }
`;

export const MyFriendsContainer = styled.div`
  height: 100%;
  width: var(--myfriend-width);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--pwf-light-gray);

  @media (max-width: 725px) {
    width: 100%;
  }
`;

// support ----------------------
export const MyFriendSupportBox = styled.div`
  width: 100%;
  height: var(--myfriend-support-box-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--pwf-light-gray);
  justify-content: flex-end;

  button {
    width: var(--myfriend-support-btn-size);
    height: var(--myfriend-support-btn-size);
    background-color: inherit;
    color: var(--pwf-gray);
    border: none;
    font-size: 16px;
    margin: 0px 2px;

    &:hover {
      color: var(--pwf-white);
    }
  }

  @media (max-width: 725px) {
    display: none;
  }
`;

export const MyFriendBtn = styled.button`
  position: relative;
`;

export const RequestCount = styled.span<{ count: number }>`
  position: absolute;
  right: 0;
  bottom: 3px;
  width: 16px;
  height: 16px;
  font-size: 10px;
  border-radius: 50%;
  color: var(--pwf-white);
  display: ${(p) => (p.count ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  background-color: var(--pwf-blue);
`;

export const MyFriendSearchBtn = styled.button``;

// 친구검색
export const MyFriendSearchBox = styled.div<{ show: boolean }>`
  width: 100%;
  height: 40px;
  display: ${(p) => (p.show ? "flex" : "none")};
  border-bottom: 1px solid var(--pwf-light-gray);
`;

export const MyFriendSearchInput = styled.input`
  flex: 1;
  height: 100%;
  background-color: inherit;
  color: var(--pwf-white);
  padding: 0px 8px;
  border: none;
`;

export const FriendSearchBtn = styled.button`
  padding: 0px 8px;
  background-color: inherit;
  border: none;
  outline: none;
  color: var(--pwf-gray);

  :hover {
    color: var(--pwf-white);
  }
`;

// 친구들 리스트
export const MyFriendsList = styled.ul`
  width: 100%;
  // overflow-y: auto;
  height: calc(100% - var(--myfriend-support-box-height));
  display: flex;
  flex-direction: column;
  position: relative;

  &::-webkit-scrollbar {
    width: var(--scroll-size);
  }

  &::-webkit-scrollbar-track {
    background-color: inherit;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-gray);
    border-radius: 10px;
  }

  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--pwf-gray);
    font-size: 15px;
  }

  @media (max-width: 725px) {
    flex-direction: row;
    height: var(--myfriend-li-mini-size);
    border-bottom: 1px solid var(--pwf-light-gray);
    // overflow-x: auto;
  }
`;

// li
export const MyFriendLi = styled.li`
  width: 100%;
  height: var(--myfriend-li-height);
  display: flex;
  align-items: center;
  padding: 0px 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: var(--pwf-background-transparent);
  }

  @media (max-width: 725px) {
    flex-direction: column;
    justify-content: center;
    width: var(--myfriend-li-mini-size);
    height: var(--myfriend-li-mini-size);
  }
`;

export const MyFriendLiProfileBox = styled.div`
  width: var(--myfriend-profile-img-size);
  height: var(--myfriend-profile-img-size);
  position: relative;
  margin-right: 13px;

  @media (max-width: 725px) {
    margin-right: 0px;
  }
`;

export const MyFriendLiImgCircle = styled.span`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  border: 1px solid var(--pwf-light-gray);
`;

export const MyFriendLiImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MyFriendOnlineCircle = styled.span`
  width: var(--myfriend-online-circle-size);
  height: var(--myfriend-online-circle-size);
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: -3px;
  z-index: 161;
  overflow: hidden;
  background-color: green;
`;

export const MyFriendLiNickname = styled.span`
  color: var(--pwf-white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 725px) {
    width: 100%;
  }
`;
export const MyFriendSupBox = styled.div<{ menu: boolean }>`
  display: ${(p) => (p.menu ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 12;
  overflow: hidden;
  box-shadow: 1.5px 1.5px 1.5px 1.5px var(--pwf-background-transparent);
  background-color: var(--pwf-signiture-color);

  button {
    padding: 6px;
    background-color: inherit;
    border: none;
    outline: none;
    color: var(--pwf-white);

    &:hover {
      background-color: var(--pwf-background-transparent-light);
    }
  }
`;
