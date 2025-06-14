import { AxiosError } from "../error/error";
import { HttpClient } from "../network/http";

import { User } from "../types/user";

export class authService extends HttpClient {
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

  // 인증코드  ----------------
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

  // 로그인 ---------------------------------
  async login(data: FormData) {
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
}

export const auth_service = new authService();
