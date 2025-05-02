import { HttpClient } from "../network/http";

import { User } from "../types/user";

export class userService extends HttpClient {
  async testing(data: FormData) {
    try {
      return await this.axiosFetch<string>("/test", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  async handleRequestFriend(data: FormData) {
    try {
      return await this.axiosFetch<{
        result: boolean;
        sender: string;
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

  // 유저 정보 얻기
  async getUser() {
    try {
      return await this.axiosFetch<User>("/current", { method: "get" });
    } catch (err) {
      throw err;
    }
  }

  // 유저 정보 겹치는것 체크
  async OverlapCheck(data: FormData) {
    try {
      return await this.axiosFetch<boolean>("/overlap_check", {
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
}

export const user_service = new userService();
