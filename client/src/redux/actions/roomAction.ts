// import { getUser } from "../reducer/userSlice";
import { streamService } from "../../service/stream.service";
import { userService } from "../../service/user.service";
// import { AppDispatch } from "";
import { createAsyncThunk } from "@reduxjs/toolkit";

// types
// import { UserAction, UserActionTypes } from "../../types/user";

class RoomAction extends streamService {
  //   requestFriendHandle = createAsyncThunk(
  //     "request/friend",
  //     async (data: FormData): Promise<any> => {
  //       try {
  //         let res = await this.handleRequestFriend(data);
  //         return await res!;
  //       } catch (error) {
  //         alert(error);
  //       }
  //     }
  //   );
}

export let roomAction = new RoomAction();
