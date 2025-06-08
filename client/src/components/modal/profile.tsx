import { useEffect, useRef, useState } from "react";
import "../../css/modal/profile.css";

import { emitter } from "../../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { User } from "../../types/user";
import { ButtonClick, FormSubmit, InputChange } from "../../types/event";

interface ProfileProps {
  user: User;
  type: string;
}

export const Profile = ({ user, type }: ProfileProps) => {
  let [nickname, setNickname] = useState<string>("");
  let fileInputRef = useRef<HTMLInputElement | null>(null);

  const changeProfile = async (e: FormSubmit) => {
    console.log("hihi");
    e.preventDefault();
  };

  const handleFileChange = async () => {
    console.log("change image");
  };

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div
      className="profile_modal"
      style={{ display: type == "profile" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={() => emitter.emit("modal", { type })}>X</button>
      </header>
      <div className="profile_content">
        <form action="post" onSubmit={changeProfile}>
          {/* img section */}
          <div className="profile_img_box">
            <span className="profile_img_circle">
              <img src={user.profile_img} />
            </span>
            {/* 이미지 변경 인풋 */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="profile_change_btn"
              onClick={handleFileClick}
            >
              <i className="fa-solid fa-camera"></i>
            </button>
          </div>

          <div className="profile_email_box">
            <label>이메일</label>
            <input
              type="email"
              disabled
              placeholder={user.email}
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="profile_nickname_box">
            <label>닉네임</label>
            <div className="profile_nickname_content">
              <input
                type="text"
                value={nickname}
                onChange={(e: InputChange) => setNickname(e.target.value)}
              />
              <button>중복확인</button>
            </div>
          </div>
        </form>
      </div>

      <footer className="profile_modal_footer">
        <button>변경하기</button>
      </footer>
    </div>
  );
};
