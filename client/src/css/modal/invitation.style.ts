import styled, { createGlobalStyle } from "styled-components";

export const InvitationGlobal = createGlobalStyle`
  :root{
    --invitation-width: 350px;
    --invitation-height: 400px;

    --invitation-li-height: 30px;

    --invitation-list-height: 60px;
    --invitation-btn-height: 50px;
  }
`;

export const InvitationContainer = styled.div`
  width: var(--invitation-width);
  height: var(--invitation-height);
  background-color: var(--pwf-signiture-color);
  border: 1px solid var(--pwf-light-gray);
  display: flex;
  flex-direction: column;
`;

export const InviteList = styled.ul`
  width: 100%;
  display: flex;
  height: var(--invitation-list-height);
  align-items: center;
  border-bottom: var(--pwf-light-gray);
  overflow-x: auto;
  position: relative;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: inherit;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-white);
    border-radius: 10px;
  }
`;

export const NoInviteText = styled.p`
  color: var(--pwf-gray);
  font-size: 14px;
  align-self: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
`;

// 초대된 친구
export const InviteLi = styled.li`
  width: var(--invitation-list-height);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const InviteUserImgBox = styled.span`
  width: calc(var(--invitation-list-height) / 2);
  height: calc(var(--invitation-list-height) / 2);
  border: 1px solid var(--pwf-light-gray);
  position: relative;
  border-radius: 50%;
`;

export const InviteUserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InviteUserDelBtn = styled.button`
  z-index: 123;
  overflow: hidden;
  position: absolute;
  right: calc(0% - 6px);
  top: 0;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
`;

export const InviteUserNick = styled.span`
  width: 100%;
  color: var(--pwf-white);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 내 친구부분
export const InvitationList = styled.ul`
  display: flex;
  height: calc(
    100% - var(--invitation-list-height) - var(--invitation-btn-height)
  );
  border-top: 1px solid var(--pwf-light-gray);
  border-bottom: 1px solid var(--pwf-light-gray);
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: inherit;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-white);
    border-radius: 10px;
  }
`;

export const InvitationBtnBox = styled.div`
  height: var(--invitation-btn-height);
  line-height: var(--invitation-btn-height);
`;

export const InvitationBtn = styled.button`
  padding: 6px;
  font-weight: 600;
  background-color: var(--pwf-blue);
  color: var(--pwf-white);
  border: none;
  outline: none;
`;

export const InvitationLi = styled.li`
  width: 100%;
  min-height: var(--invitation-li-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;

  div {
    width: 80%;
    display: flex;
    align-items: center;
  }
`;

export const InvitationProfileCricle = styled.span`
  width: calc(var(--invitation-li-height));
  height: calc(var(--invitation-li-height));
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  border: 1px solid var(--pwf-light-gray);
`;

export const InvitationProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InviationUserNick = styled.span`
  font-size: 16px;
  color: var(--pwf-white);
  font-weight: 600;
`;
