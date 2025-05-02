import { useSelector } from "react-redux";
import "../css/myfriends.css";
import { RootState } from "../context/store";
import { useEffect } from "react";

import { User } from "../types/user";

export const MyFriendLi = (props: { user: User }) => {
  return (
    <li className="friend_li">
      {/* 친구 이미지 */}
      <span className="friend_img">
        <img src={props.user.profile_img} />
      </span>
      {/* 친구 닉네임 */}
      <span className="friend_nickname">{props.user.nickname}</span>
      <span className="friend_online_state"></span>
    </li>
  );
};

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
