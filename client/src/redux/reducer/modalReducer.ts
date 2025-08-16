// library
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { userAction } from "../actions/userAction";

// type
import { User } from "../../types/user";
import { friendAction } from "../actions/friendAction";

interface modalProps {
  active?: boolean;
  type?:
    | null
    | "friend"
    | "delete"
    | "stream"
    | "authcode"
    | "password"
    | "invite";

  email?: string;
  auth?: { status?: boolean; type?: null | "signup" | "password reset" };
}

const initialState: modalProps = {
  active: false,
  type: null,
  email: "",
  auth: { status: false, type: null },
};

const modalSlice = createSlice({
  name: "modal",
  initialState, // reducer
  reducers: {
    modalState: (state: any, data: PayloadAction<modalProps>) => {
      let { active, type, email, auth } = data.payload;
      if (active !== undefined) state.active = active;
      if (type !== undefined) state.type = type;
      if (email !== undefined) state.email = email;
      if (auth !== undefined) {
        if (auth.status !== undefined) state.auth.status = auth.status;
        if (auth.type !== undefined) state.auth.type = auth.type;
      }
    },
    init: (current) => (current = initialState),
  },
});

export const { modalState } = modalSlice.actions;
export default modalSlice.reducer;
