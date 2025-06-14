import { getIo } from "../util/socket";
import { User } from "../types/user";
import { Socket } from "socket.io";

import { userOnlineFriend } from "../util/auth";
import { redisGet } from "../util/redis";

// export const userLogin = async (user: User) => {};
export const p2pSignalling = async (socket: Socket, user: User) => {
  let io = getIo();
  //   방 참여시 조인
  socket.on("join", (room_id: string) => {
    socket.join(room_id);
    // socket.to(room_id).emit("other join", user.nickname);
  });

  // 오디오/비디오 트랙 컨트롤
  socket.on(
    "toggle track",
    (room_id: string, to: string, type: "audio" | "video", state: boolean) => {
      socket.to(room_id).emit("toggle track", to, type, state);
    }
  );

  // 화면 공유
  socket.on("share screen", (room_id: string, from: string) => {
    socket.to(room_id).emit("share screen", from);
  });

  // 화면 공유 종료
  socket.on("share screen off", (room_id: string) => {
    socket.to(room_id).emit("share screen off", `${room_id}화면 공유 종료`);
  });

  //   offer
  socket.on(
    "offer",
    (from: string, to: string, offer: RTCSessionDescriptionInit) => {
      io.to(`online:${to}`).emit("offer", from, offer);
    }
  );

  // answer
  socket.on(
    "answer",
    (from: string, to: string, answer: RTCSessionDescriptionInit) => {
      io.to(`online:${to}`).emit("answer", from, answer);
    }
  );

  // candidate
  socket.on(
    "candidate",
    (from: string, to: string, candidate: RTCIceCandidate) => {
      io.to(`online:${to}`).emit("candidate", from, candidate);
    }
  );

  // room exit
  socket.on("leave room", (who: string, room_id: string) => {
    socket.to(room_id).emit("leave room", who);
    socket.leave(room_id);
  });
};
