import { combineReducers } from "@reduxjs/toolkit";

import UserReducer from "./userReducer";

const rootReducer = combineReducers({
  user: UserReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
