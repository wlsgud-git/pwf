// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { FriendOnlineStatus, User } from "../../types/user";
import { Room } from "../../types/room";
import { userSocket } from "../../util/socket";

interface userReducer {
  // getUser(state: User, info: PayloadAction<User>): void;
  //   createUser(state: User, info: PayloadAction<string>): void;
  //   updateUser: (state: User, info: User) => void;
  //   deleteUser: (state: User, id: string) => void;
}

const initialState: User = {
  id: 0,
  nickname: "",
  profile_img: "",
  friends: [],
  email: "",
  request_friends: [],
  stream_room: [],
};

const userSlice = createSlice({
  name: "user",
  initialState, // reducer
  reducers: {
    onlineUpdate: (current: any, data: PayloadAction<User>) => {
      let { nickname, online } = data.payload;
      return {
        ...current,
        friends: current.friends.map((val: User) =>
          val.nickname == nickname ? { ...val, online } : val
        ),
      };
    },

    insertReceiver: (current: any, data: PayloadAction<User>) => {
      let { nickname, profile_img, online } = data.payload;

      return { ...current, friends: [...current.friends, data.payload] };
    },

    userInit: (current: any) => (current = initialState),
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let {
        id,
        email,
        nickname,
        profile_img,
        request_friend_list,
        friends,
        stream_room,
      } = action.payload;

      state.id = id;
      state.email = email;
      state.profile_img = profile_img;
      state.nickname = nickname;

      if (request_friend_list && request_friend_list.length)
        state.request_friends = request_friend_list.map((val: User) => val);
      if (friends && friends.length)
        state.friends = friends.map((val: User) => val);
      if (stream_room && stream_room.length)
        state.stream_room = stream_room.map((val: Room) => val);
      userSocket();
      // return state;
    });

    // 친구요청에 대한 결과
    builder.addCase(
      userAction.requestFriendHandle.fulfilled,
      (state, action) => {
        let { sender, msg } = action.payload;

        state.request_friends = state.request_friends?.filter((val) => {
          if (val.nickname == sender.nickname) state.friends?.push(sender);
          return val.nickname != sender.nickname;
        });

        alert(msg);
        return;
      }
    );
  },
});

export const { onlineUpdate, insertReceiver, userInit } = userSlice.actions;
export default userSlice.reducer;
