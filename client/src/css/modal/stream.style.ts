import styled from "styled-components";

export const StreamContent = styled.div`
  width: 540px;
  //   height: 460px;
  background-color: var(--pwf-signiture-color);
  border-radius: 10px;
`;

export const StreamForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px 35px;
  align-items: center;
`;

export const StreamContentDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
`;

export const StreamContentLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: var(--pwf-white);
  margin-bottom: 10px;
`;

// 방이름

export const StreamRoomNameInput = styled.input`
  width: 100%;
  padding: 12px 7px;
  color: var(--pwf-white);
  background-color: inherit;
  border: 1px solid var(--pwf-gray);
`;

// 참여자 -------------------
export const StreamRoomInviteList = styled.ul<{ length: number }>`
  width: 100%;
  display: flex;
  align-items: center;
  //   border: ${(p) => (p.length ? "1px solid var(--pwf-white)" : "none")};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: var(--scroll-size);
  }

  &::-webkit-scrollbar-track {
    background-color: inherit;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-gray);
    border-radius: 10px;
  }
`;

export const StreamRoomNoInvite = styled.p`
  color: var(--pwf-gray);
`;

export const InviteLi = styled.li`
  width: 74px;
  height: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

export const InviteLiImgBox = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
`;

export const InviteImgCircle = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--pwf-light-gray);
`;

export const InviteUserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InviteOutBtn = styled.button`
  position: absolute;
  right: -3px;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InviteUserNick = styled.span`
  color: white;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 친구목록 ----------------------
export const InviteFriendList = styled.ul<{ length: number }>`
  width: 100%;
  max-height: 140px;
  overflow-y: auto;
  border: ${(p) => (p.length ? "1px solid var(--pwf-light-gray)" : "none")};

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
`;

export const InviteFriendNo = styled.p`
  color: var(--pwf-gray);
`;

export const FriendLi = styled.li`
  width: 100%;
  display: flex;
  height: 40px;
  padding: 0px 8px;
  align-items: center;
`;

export const FriendInviteSelectInput = styled.input``;

export const FriendImgCircle = styled.span`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin: 0px 8px;
  overflow: hidden;
  border: 1px solid var(--pwf-white);
`;

export const FriendImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FriendNickname = styled.span`
  color: var(--pwf-white);
`;

// 전송버튼 ------------------------
export const CreateStreamRoomBtn = styled.button`
  background-color: var(--pwf-blue);
  color: var(--pwf-white);
  border: none;
  outline: none;
  padding: 8px;
  font-weight: 600;
`;
