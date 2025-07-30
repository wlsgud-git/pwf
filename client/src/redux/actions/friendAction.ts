// import { getUser } from "../reducer/userSlice";
import { userService } from "../../service/user.service";
// import { AppDispatch } from "";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseFriendProps, User } from "../../types/user";

// types
// import { UserAction, UserActionTypes } from "../../types/user";

class FriendAction extends userService {
  // 친구요청 수락 or 거절
  requestFriendHandle = createAsyncThunk(
    "request/friend",
    async (data: ResponseFriendProps): Promise<any> => {
      try {
        let res = await this.handleRequestFriend(data);
        return await res;
      } catch (error) {
        alert(error);
      }
    }
  );
}

export let friendAction = new FriendAction();
