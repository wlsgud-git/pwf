import { useEffect, useState } from "react";
import "../../css/modal/profile.css";

import { emitter } from "../../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { User } from "../../types/user";

interface ProfileProps {
  user: User;
  type: string;
}

export const Profile = ({ user, type }: ProfileProps) => {
  return (
    <div
      className="profile_modal"
      style={{ display: type == "profile" ? "flex" : "none" }}
    >
      <div className="profile_content">
        <form action="post">
          {/* img section */}
          <div className="profile_img_box">
            <span className="profile_img_circle">
              <img src={user.profile_img} />
            </span>
          </div>

          <div className="profile_email_box">
            <label>이메일</label>
            <input
              type="email"
              disabled
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="profile_nickname_box">
            <label>닉네임</label>
            <input type="text" />
          </div>
        </form>
      </div>

      <footer className="profile_modal_footer">
        <button>변경하기</button>
      </footer>
    </div>
  );
};
