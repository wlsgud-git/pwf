import { useSelector } from "react-redux";
import "../css/myfriends.css";
import { RootState } from "../context/store";
import { useEffect } from "react";

import { User, UserComponent } from "../types/user";

// 내 친구
export const MyFriendLi = ({ user }: UserComponent) => {
  return (
    <li className="friend_li">
      {/* 친구 이미지 */}
      <span className="friend_img">
        <img src={user.profile_img} />
      </span>
      {/* 친구 닉네임 */}
      <span className="friend_nickname">{user.nickname}</span>
      <span
        className="friend_online_state"
        style={{ backgroundColor: user.online ? "green" : "red" }}
      ></span>
    </li>
  );
};

// 내 친구들리스트
export const MyFriends = () => {
  let user = useSelector((state: RootState) => state.user);

  return (
    <ul className="pwf-my_friends">
      {user.friends && user.friends.length
        ? user.friends.map((val) => <MyFriendLi user={val} />)
        : ""}
    </ul>
  );
};
