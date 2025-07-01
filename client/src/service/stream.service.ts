import { HttpClient } from "../network/http";
import { Room } from "../types/room";

export class streamService extends HttpClient {
  // 스트리밍 방 -----------------------------
  async getStreamRoomData(id: string) {
    try {
      return await this.axiosFetch<Room>(`/room/${id}`, { method: "get" });
    } catch (err) {
      throw err;
    }
  }

  // 방 만들기
  async createStreamRoom(data: FormData) {
    try {
      return await this.axiosFetch<Room>("/room", {
        method: "post",
        body: data,
      });
    } catch (err) {
      throw err;
    }
  }

  // 방 삭제
  async deleteStreamRoom(data: FormData) {
    try {
      return;
    } catch (err) {
      throw err;
    }
  }

  async roomAccessToken(data: FormData) {
    try {
      let res = await this.axiosFetch<Room>("/room/token", {
        method: "post",
        body: data,
      });
      return res.token;
    } catch (err) {
      throw err;
    }
  }
}

export const stream_service = new streamService();
