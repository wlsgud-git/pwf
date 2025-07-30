import styled from "styled-components";

export const FriendContent = styled.div`
  width: 600px;
  height: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const FriendSearchBox = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 25px;
  flex-direction: column;
`;

export const FriendSearchForm = styled.form`
  width: 100%;
  display: flex;
`;

export const FriendSearchInput = styled.input<{ error: boolean }>`
  width: 100%;
  padding: 10px 12px;
  display: flex;
  background-color: inherit;
  border: ${(p) => `1px solid var(--pwf-${p.error ? "red" : "gray"})`};
  color: var(--pwf-white);
  margin-bottom: 5px;

  & focus {
    border: 1px solid var(--pwf-white);
  }
`;

export const FriendSearchError = styled.span<{ error: boolean }>`
  font-size: 14px;
  color: var(--pwf-red);
  display: ${(p) => (p.error ? "flex" : "none")};
`;

export const FriendRequestBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const FriendRequestLabel = styled.label`
  font-size: 17px;
  color: var(--pwf-white);
  margin-bottom: 15px;
`;

export const FriendRequstList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    // background-color: blue;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--pwf-white);
    border-radius: 10px;
  }
`;

export const FriendRequstEmpty = styled.p`
  color: var(--pwf-white);
`;

// list
export const FriendLi = styled.li`
  width: 100%;
  height: var(--friend-list-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  &:hover {
    background-color: var(--pwf-background-transparent-light);
  }
`;

export const FriendLiUserBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const FriendLiProfileBox = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  border: 1px solid white;
`;

export const FriendLiProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FriendLiNickname = styled.span`
  color: var(--pwf-white);
`;

export const FriendBtnBox = styled.div`
  display: flex;
`;

export const FriendLiBtn = styled.button`
  margin: 0px 3px;
  color: var(--pwf-gray);
  font-size: 17px;
  border: none;
  padding: 8px;
  background-color: inherit;
  border-radius: 4px;

  &:hover {
    color: var(--pwf-white);
  }
`;
