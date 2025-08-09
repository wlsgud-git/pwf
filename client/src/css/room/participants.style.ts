import styled from "styled-components";

export const ParticipantsContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 6px;
  background-color: transparent;
  border: none;
  outline: none;
  font-weight: bold;
  color: var(--pwf-light-gray);
  font-size: 17px;
`;

export const ParticipantStateBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: bold;
`;

export const ParticipantsState = styled.span`
  color: var(--pwf-white);
`;

export const ParticipantsStateList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// 참가자 개인
export const ParticipantLi = styled.li`
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ParticipantInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

export const ParticipantImgCircle = styled.span`
  width: 35px;
  height: 35px;
  border: 1px solid var(--pwf-light-gray);
  border-radius: 50%;
  margin-right: 8px;
  overflow: hidden;
`;

export const ParticipantImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ParticipantNick = styled.span`
  color: var(--pwf-white);
`;

export const ParticipantReqFriendBtn = styled.button<{ friend: boolean }>`
  display: ${(p) => (p.friend ? "none" : "flex")};
  background-color: inherit;
  border: none;
  outline: none;
  padding: 4px;
  color: var(--pwf-gray);

  &:hover {
    color: var(--pwf-white);
  }
`;
