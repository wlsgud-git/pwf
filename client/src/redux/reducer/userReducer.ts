// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { Room } from "../../types/room";
import { socketConnect } from "../../util/socket";

const initialState: User = {
  id: 0,
  nickname: "",
  profile_img: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState, // reducer
  reducers: {
    // onlineUpdate: (current: any, data: PayloadAction<User>) => {
    //   let { nickname, online } = data.payload;
    //   return {
    //     ...current,
    //     friends: current.friends.map((val: User) =>
    //       val.nickname == nickname ? { ...val, online } : val
    //     ),
    //   };
    // },
    // insertReceiver: (current: any, data: PayloadAction<User>) => {
    //   let { nickname, profile_img, online } = data.payload;
    //   return { ...current, friends: [...current.friends, data.payload] };
    // },
    userInit: (current: any) => (current = initialState),
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let { id, email, nickname, profile_img } = action.payload.user;

      state.id = id;
      state.email = email;
      state.profile_img = profile_img;
      state.nickname = nickname;

      socketConnect(action.payload.user);
    });

    // 친구요청에 대한 결과
    // builder.addCase(
    //   userAction.requestFriendHandle.fulfilled,
    //   (state, action) => {
    //     let { sender, msg } = action.payload;

    //     state.request_friends = state.request_friends?.filter((val) => {
    //       if (val.nickname == sender.nickname) state.friends?.push(sender);
    //       return val.nickname != sender.nickname;
    //     });

    //     alert(msg);
    //     return;
    //   }
    // );
  },
});

export const { userInit } = userSlice.actions;
export default userSlice.reducer;
