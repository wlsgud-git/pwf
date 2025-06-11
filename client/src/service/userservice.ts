import { HttpClient } from "../network/http";

import { User } from "../types/user";

export class userService extends HttpClient {
  // Authentication Or Authorization ----------------------------------
  // 유저 정보 얻기
  async getUser() {
    try {
      return await this.axiosFetch<User>("/current", { method: "get" });
    } catch (err) {
      throw err;
    }
  }
  // 이메일 중복 체크
  async emailOverlap(data: FormData) {
    try {
      return await this.axiosFetch<boolean>("/email/overlap", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }
  // 닉네임 중복 체크
  async nicknameOverlap(data: FormData) {
    try {
      return await this.axiosFetch<boolean>("/nickname/overlap", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  // login ---------------------------------
  // 로그인
  async sendLoginInfo(data: FormData) {
    try {
      return await this.axiosFetch<User>("/login", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  // 로그아웃
  async logout() {
    try {
      return await this.axiosFetch<string>("/logout", {
        method: "post",
      });
    } catch (err) {
      throw err;
    }
  }

  // requestFriend ------------------------
  // 친구요청 수락/거절
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
  async account(data: FormData) {
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
  async sendUserInfo(data: FormData) {
    try {
      return await this.axiosFetch<User>(`/user_info`, {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }
  // 인증코드 재전송
  async resendAuthcode(data: FormData) {
    try {
      return await this.axiosFetch<boolean>("/send_authcode", {
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
