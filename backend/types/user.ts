export interface User {
  id?: number | undefined;
  nickname: string | undefined;
  email: string | undefined;
  password?: string | undefined;
  password_check?: string | undefined;
  create_at?: Date | undefined;
  profile_img?: string | undefined;
  friends?: User[] | undefined;
  // my_room? :
}
