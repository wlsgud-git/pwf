import { Room } from "./room";

export interface User {
  id?: number;
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
  img_key?: string | null;
  loading?: boolean;
}

export interface FriendOnlineStatus {
  nickname: string;
  state: boolean;
}

export interface UserComponent {
  [user: string]: User;
}

export interface UserInputProps {
  value: string;
  active?: boolean;
  error: boolean;
  show?: boolean;
  error_msg: string;
}

export interface UserButtonProps {
  active: boolean;
  loading: boolean;
}

export interface RequestFriendProps {
  receiver: string;
}

export interface ResponseFriendProps {
  sender: string;
  response: boolean;
}
// export interface Friend
