import { User } from "./user";

export interface Room {
  id?: number | undefined;
  room_name?: string | undefined;
  participants?: User[] | number[];
  create_at?: Date;
}

export interface StreamInfomation {
  stream: MediaStream;
  video?: boolean;
  audio?: boolean;
}
