import { HttpClient } from "../network/http";
import { Room } from "../types/room";

export class streamService extends HttpClient {
  // 방 정보보기
  async getStreamRoomData(id: number) {
    // try {
    //   return await this.axiosFetch<User>("/current", { method: "get" });
    // } catch (err) {
    //   throw err;
    // }
  }
  //
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
}

export const stream_service = new streamService();
