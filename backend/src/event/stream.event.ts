import { getIo } from "../util/socket.util";
import { User } from "../types/user.types";
import { Room } from "../types/streamroom.types";

export const inviteStreamingRoom = (list: User[], room: Room) => {
  let io = getIo();
  list.map((val: any) =>
    io.to(`user:${val.nickname}`).emit("invite room", room)
  );
};

export const insertNewUser = (room: Room, new_users: User[]) => {
  let io = getIo();
  let participants = room.participants as User[];
  participants.map((val) =>
    io
      .to(`user:${val.nickname}`)
      .emit("insert user", { id: room.id, new_users })
  );
};
