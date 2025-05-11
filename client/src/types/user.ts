import { Room } from "./room";

export interface User {
  id?: number | undefined;
  nickname?: string;
  email?: string;
  password?: string;
  password_check?: string;
  create_at?: Date;
  friends?: User[];
  profile_img?: string;
  stream_room?: Room[];
  request_friends?: User[];
  online?: boolean;
}

export interface FriendOnlineStatus {
  nickname: string;
  state: boolean;
}

export interface UserComponent {
  [user: string]: User;
}
