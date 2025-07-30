// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { friendAction } from "../actions/friendAction";

interface modalProps {
  active: boolean;
  type: null | "friend" | "delete";
}

const initialState: modalProps = {
  active: false,
  type: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState, // reducer
  reducers: {
    modalState: (state: any, data: PayloadAction<modalProps>) => {
      let { active, type } = data.payload;
      state.active = active;
      state.type = type;
    },
    init: (current) => (current = initialState),
  },
});

export const { modalState } = modalSlice.actions;
export default modalSlice.reducer;
