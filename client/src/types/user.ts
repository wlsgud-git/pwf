export interface User {
  id?: number;
  nickname?: string;
  email?: string;
  password?: string;
  password_check?: string;
  create_at?: Date;
  friends?: User[];
  profile_img?: string;
  stream_room?: [];
  request_friends?: User[];
}

export interface UserComponent {
  [user: string]: User;
}
