import { HttpClient } from "../network/http";

import { User } from "../types/user";

export class userService extends HttpClient {
  // 유저 ----------------
  async getUser() {
    try {
      return await this.axiosFetch<User>("/current", { method: "get" });
    } catch (err) {
      throw err;
    }
  }

  async changeNickname(data: FormData) {
    try {
      return await this.axiosFetch<User>("/update/nickname", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async changeProfileImg(data: FormData) {
    try {
      return await this.axiosFetch<User>("/update/profile_img", {
        method: "post",
        body: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(email: string) {
    try {
      return await this.axiosFetch<string>(`/delete/${email}`, {
        method: "delete",
      });
    } catch (err) {
      throw err;
    }
  }

  // 친구요청 ------------------------
  //
  async handleRequestFriend(data: FormData) {
    try {
      return await this.axiosFetch<{
        result: boolean;
        sender: User;
        msg: string;
      }>(`/request/friend/response`, {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  // 친구요청
  async requestFriend(data: FormData) {
    try {
      return await this.axiosFetch<User>(`/request/friend`, {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  // signup -----------------------------
  // 회원가입
  async account(data: User) {
    try {
      return await this.axiosFetch<boolean>("/account", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }
  //회원가입 유저정보 보내기
  async accountUser(data: any) {
    try {
      return await this.axiosFetch<User>(`/account/user`, {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async passwordChange(data: FormData) {
    try {
      return await this.axiosFetch<string>("/password_change", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }
}

export const user_service = new userService();
