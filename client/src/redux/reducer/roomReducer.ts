// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { Room } from "../../types/room";
import { roomAction } from "../actions/roomAction";

const initialState: { [id: number]: Room } = {};

const roomSlice = createSlice({
  name: "room",
  initialState, // reducer
  reducers: {
    inviteRoom: (state: any, data: any) => {
      let room = data.payload;
      state[room.id] = room;
    },

    insertUser: (state: any, data: any) => {
      let { id, new_users } = data.payload;
      console.log(id, new_users);

      state[id].participants = state[id].participants.concat(new_users);
    },

    init: (current) => initialState,
  },

  // actions
  extraReducers: (builder) => {
    // 세션으로 유저 정보 가져오기
    builder.addCase(userAction.getUserAction.fulfilled, (state, action) => {
      let { stream_room } = action.payload.user;

      if (stream_room && stream_room.length)
        stream_room.map((val: Room) => (state[val.id!] = val));

      return state;
    });
  },
});

export const { inviteRoom, insertUser } = roomSlice.actions;
export default roomSlice.reducer;
