// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { friendAction } from "../actions/friendAction";

interface FriendProps {
  request_friends: { [id: number]: User };
  friends: { [id: number]: User };
}

const initialState: FriendProps = {
  request_friends: {},
  friends: {},
};

const friendSlice = createSlice({
  name: "friend",
  initialState, // reducer
  reducers: {
    friendRequest: (state: any, data: any) => {
      console.log("hihi");
      state.request_friends[data.payload.from.id] = data.payload.from;
    },

    friendReqeustHandle: (state: any, data: any) => {
      state.friends[data.payload.id] = data.payload;
    },

    friendOnlineUpdate: (state: any, data: any) => {
      state.friends[data.payload.who.id].online = data.payload.online;
    },
    init: (current) => (current = initialState),
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let { request_friends, friends } = action.payload.user;

      if (request_friends && request_friends.length)
        request_friends.map(
          (val: User) => (state.request_friends[val.id!] = val)
        );
      if (friends && friends.length)
        friends.map((val: User) => (state.friends[val.id!] = val));
    });

    // 친구요청에 대한 결과
    builder.addCase(
      friendAction.requestFriendHandle.fulfilled,
      (state, action) => {
        console.log(action.payload);
        let { sender, response } = action.payload;
        delete state.request_friends[sender.id];
        if (response) state.friends[sender.id] = sender;
      }
    );
  },
});

export const { friendRequest, friendReqeustHandle, friendOnlineUpdate } =
  friendSlice.actions;
export default friendSlice.reducer;
