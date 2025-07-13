export interface User {
  id?: number;
  nickname: string;
  email?: string;
  password?: string | undefined;
  password_check?: string | undefined;
  create_at?: Date | undefined;
  profile_img?: string | undefined;
  friends?: User[] | undefined;
  online?: boolean;
  // my_room? :
}
