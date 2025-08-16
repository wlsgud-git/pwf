import { HttpClient } from "../network/http";

import { RequestFriendProps, ResponseFriendProps, User } from "../types/user";

export class userService extends HttpClient {
  // 유저 ----------------
  async getUser() {
    try {
      return await this.axiosFetch<User>("/current", { method: "get" });
    } catch (err) {
      throw err;
    }
  }

  // 닉네임 변경
  async changeNickname(data: { id: number; nickname: string }) {
    try {
      return await this.axiosFetch<User>("/update/nickname", {
        method: "post",
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw err;
    }
  }

  // 프로필 이미지 변경
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

  // 유저 삭제
  async deleteUser(email: string) {
    try {
      return await this.axiosFetch<string>(`/delete/${email}`, {
        method: "delete",
      });
    } catch (err) {
      throw err;
    }
  }

  // 친구관련 ------------------------

  // 친구요청
  async requestFriend(data: RequestFriendProps) {
    try {
      return await this.axiosFetch<User>(`/request/friend`, {
        method: "post",
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw err;
    }
  }

  // 친구요청 응답
  async handleRequestFriend(data: ResponseFriendProps) {
    try {
      return await this.axiosFetch(`/request/friend/response`, {
        method: "post",
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw err;
    }
  }

  // 친구 삭제
  async deleteFriend(nick: string) {
    try {
      return await this.axiosFetch(`/friend/${nick}`, {
        method: "delete",
      });
    } catch (err) {
      throw err;
    }
  }

  // 닉네임으로 친구들 검색
  async searchFriendsByNick(nickname: string) {
    try {
      return await this.axiosFetch(`/search/friends?nickname=${nickname}`, {
        method: "get",
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

  async passwordChange(data: {
    email: string;
    password: string;
    password_check: string;
  }) {
    try {
      return await this.axiosFetch<string>("/password_change", {
        method: "post",
        body: JSON.stringify(data),
      });
    } catch (err) {
      throw err;
    }
  }
}

export const user_service = new userService();
