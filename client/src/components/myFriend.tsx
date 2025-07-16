import { useSelector } from "react-redux";
import "../css/myfriends.css";
import { RootState } from "../redux/store";
import { useEffect } from "react";

import { User, UserComponent } from "../types/user";

// 내 친구
export const MyFriendLi = ({ user }: UserComponent) => {
  return (
    <li className="friend_li">
      <div className="friend_info">
        {/* 친구 이미지 */}
        <span className="friend_img">
          <img src={user.profile_img} />
        </span>
        {/* 친구 닉네임 */}
        <span className="friend_nickname">{user.nickname}</span>
      </div>
      {/* 해당 친구 온라인 상태 유무 */}
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
  let { friends } = useSelector((state: RootState) => state.friend);

  return (
    <ul className="pwf-my_friends">
      {Object.entries(friends).map(([key, value]) => (
        <MyFriendLi user={value} />
      ))}
    </ul>
  );
};
