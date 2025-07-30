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
  online: false,
  img_key: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState, // reducer
  reducers: {
    changeProfileImg: (state: any, data: any) => {
      let { key, url } = data.payload;
      state.profile_img = url;
      state.img_key = key;
    },

    setLoading: (state: any, data: PayloadAction<boolean>) => {
      console.log(data.payload);
    },
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
      let { id, email, nickname, profile_img, img_key } = action.payload.user;

      state.id = id;
      state.email = email;
      state.profile_img = profile_img;
      state.nickname = nickname;
      state.img_key = img_key;
      state.online = true;

      socketConnect(action.payload.user);
    });
  },
});

export const { userInit, changeProfileImg, setLoading } = userSlice.actions;
export default userSlice.reducer;
