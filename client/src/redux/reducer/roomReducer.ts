// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { Room } from "../../types/room";
import { roomAction } from "../actions/roomAction";

const initialState: Room[] = [];

const roomSlice = createSlice({
  name: "room",
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
    init: (current) => initialState,
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let { stream_room } = action.payload.user;

      if (stream_room && stream_room.length) return stream_room;
      return state;
    });

    // 방 생성
    builder.addCase(roomAction.createRoom.fulfilled, (state, action) => {
      let { msg, room } = action.payload;

      state.push(room);
    });
  },
});

export const {} = roomSlice.actions;
export default roomSlice.reducer;
