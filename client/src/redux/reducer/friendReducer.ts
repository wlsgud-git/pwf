// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { friendAction } from "../actions/friendAction";

const initialState: User = {
  request_friends: [],
  friends: [],
};

const friendSlice = createSlice({
  name: "friend",
  initialState, // reducer
  reducers: {
    friendRequest: (state: any, data: any) => {
      state.request_friends.push(data.payload.from);
    },

    friendReqeustHandle: (state: any, data: any) => {
      state.friends.push(data.payload);
    },
    init: (current) => (current = initialState),
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let { request_friends, friends } = action.payload.user;

      if (request_friends && request_friends.length)
        state.request_friends = request_friends.map((val: User) => val);
      if (friends && friends.length)
        state.friends = friends.map((val: User) => val);
    });

    // 친구요청에 대한 결과
    builder.addCase(
      friendAction.requestFriendHandle.fulfilled,
      (state, action) => {
        let { sender, response } = action.payload;
        state.request_friends = state.request_friends!.filter((val) => {
          if (val.nickname == sender.nickname && response)
            state.friends?.push(sender);
          return val.nickname != sender.nickname;
        });
      }
    );
  },
});

export const { friendRequest, friendReqeustHandle } = friendSlice.actions;
export default friendSlice.reducer;
