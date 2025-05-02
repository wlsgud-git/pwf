import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

import UserReducer from "./reducer/userReducer";

export const store = configureStore({
  reducer: {
    user: UserReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
