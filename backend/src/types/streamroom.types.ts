import { User } from "./user.types";

export interface Room {
  id?: number | undefined;
  room_name: string | undefined;
  participants: number[] | User[];
  create_at?: Date;
}
