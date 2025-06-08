// import { getUser } from "../reducer/userSlice";
import { userService } from "../../service/userservice";
// import { AppDispatch } from "";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { useNavigate } from "react-router-dom";

// types
// import { UserAction, UserActionTypes } from "../../types/user";
import { User } from "../../types/user";
import { errorHandling } from "../../error/error";
import { HttpResponse } from "../../types/http";

class UserAction extends userService {
  // 친구요청 수락 or 거절
  requestFriendHandle = createAsyncThunk(
    "request/friend",
    async (data: FormData): Promise<any> => {
      try {
        let res = await this.handleRequestFriend(data);
        return await res!;
      } catch (error) {
        alert(error);
      }
    }
  );

  // 유저 정보 불러오기
  getUserAction = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }): Promise<any> => {
      try {
        let res = await this.getUser();
        return await res!;
      } catch (error: any) {
        return rejectWithValue(error.response!.data || "unknown error");
      }
    }
  );
}

export let userAction = new UserAction();
