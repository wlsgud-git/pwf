import { combineReducers } from "@reduxjs/toolkit";

import UserReducer from "./userReducer";
import FriendReducer from "./friendReducer";
import RoomReducer from "./roomReducer";
import ModalReducer from "./modalReducer";

import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  user: UserReducer,
  friend: FriendReducer,
  room: RoomReducer,
  modal: ModalReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type == "RESET_ALL_STATE") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
export default rootReducer;
