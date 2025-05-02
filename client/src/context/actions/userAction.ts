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
  getUserAction = createAsyncThunk("user/fetchUser", async (): Promise<any> => {
    try {
      let res = await this.getUser();
      return await res!;
    } catch (error) {
      window.location.href = "/login";
    }
  });
  //   modifyList = (id, fullname) => {
  //     return async (dispatch, getState) => {
  //       let state = getState();
  //       let { check } = state.fileList;
  //       if (id in check) dispatch(updateList({ id, fullname }));
  //     };
  //   };
  //   deleteFileList = (id, fullname) => {
  //     return async (dispatch, getState) => {
  //       let state = getState();
  //       let list = state.fileList.list;
  //       let new_id;
  //       let ft = fullname.join("/");
  //       if (!list.filter((val) => val.fullname.join("/") === ft).length) return;
  //       if (list.length >= 2) new_id = list[list[0].id == id ? 1 : 0].id;
  //       else new_id = 0;
  //       try {
  //         const res = await dictService.deleteFileList(id);
  //         dispatch(deleteList(id));
  //         dispatch(changeId({ id: new_id, type: false }));
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //   };
}

export let userAction = new UserAction();
