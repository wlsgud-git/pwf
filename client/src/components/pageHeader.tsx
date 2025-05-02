// css
import { profile } from "console";
import "../css/pageheader.css";

import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Head from "../image/head.jpg";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

interface ModalProps {
  state: boolean;
  type: string;
}

export const PageHeader = () => {
  let user = useSelector((state: RootState) => state.user);
  let [userOption, setUserOption] = useState<boolean>(false);

  return (
    <header className="pwf_header">
      <span>
        <Link to="/result" className="home_anchor">
          PWF
        </Link>
      </span>

      <div className="header_control">
        {/* 친구추가 */}
        <div className="pwf_friend_box">
          <button
            className="friend_btn"
            onClick={() => emitter.emit("friend modal", true)}
          >
            <i className="fa-solid fa-user-plus"></i>
          </button>

          <span
            className="friend_add_number"
            style={{
              display:
                user.request_friends && user.request_friends.length
                  ? "flex"
                  : "none",
            }}
          >
            {user.request_friends && user.request_friends.length
              ? user.request_friends.length
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
            <button onMouseDown={() => emitter.emit("profile modal", true)}>
              내 프로필
            </button>
            <button>로그아웃</button>
          </div>
        </div>
      </div>
    </header>
  );
};
