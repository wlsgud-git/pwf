// css
import "../css/pageheader.css";

import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userInit } from "../redux/reducer/userReducer";

import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { AppDispatch, persistor, RootState } from "../redux/store";
import { socketClient } from "../util/socket";
import { useDispatch } from "react-redux";
import { auth_service } from "../service/auth.service";
import { resetAllstate } from "../redux/actions/root.action";
import { modalState } from "../redux/reducer/modalReducer";

export const PageHeader = () => {
  let navigate = useNavigate();
  let user = useSelector((state: RootState) => state.user);
  let request_friends = useSelector(
    (state: RootState) => state.friend.request_friends
  );
  let dispatch = useDispatch<AppDispatch>();
  let [userOption, setUserOption] = useState<boolean>(false);

  const logout = async () => {
    try {
      await auth_service.logout();
      dispatch(resetAllstate());
      socketClient.disconnect();
      navigate("/login");
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <header className="pwf_header">
      <span>
        <Link to="/" className="home_anchor">
          PWF {user.nickname}
        </Link>
      </span>

      <div className="header_control">
        <button
          onClick={() => dispatch(modalState({ active: true, type: "delete" }))}
        >
          del hi
        </button>
        {/* 친구추가 */}
        <div className="pwf_friend_box">
          <button
            className="friend_btn"
            onClick={() =>
              dispatch(modalState({ active: true, type: "friend" }))
            }
          >
            <i className="fa-solid fa-user-plus"></i>
          </button>

          <span
            className="friend_add_number"
            style={{
              display: Object.entries(request_friends).length ? "flex" : "none",
            }}
          >
            {Object.entries(request_friends).length
              ? Object.entries(request_friends).length
              : ""}
          </span>
        </div>

        {/* 유저 프로필 */}
        <div className="pwf_user_box">
          <button
            className="pwf_user_btn"
            onFocus={() => setUserOption(true)}
            onBlur={() => setUserOption(false)}
          >
            <img src={user.profile_img} />
          </button>

          <div
            className="check_box"
            style={{ display: userOption ? "flex" : "none" }}
          >
            <button onMouseDown={() => navigate(`/profile/${user.email}`)}>
              <i className="fa-solid fa-user"></i>
              <span>프로필</span>
            </button>
            <button onMouseDown={logout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
