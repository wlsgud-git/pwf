import { useEffect, useState } from "react";
import "../css/profile.css";

import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

export const ProfileModal = () => {
  let user = useSelector((state: RootState) => state.user);
  let [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = (open: boolean) => setOpen(open);
    emitter.on("profile modal", handler);

    return () => {
      emitter.off("profile modal", handler);
    };
  }, []);

  return (
    <div className="modal_box" style={{ display: open ? "flex" : "none" }}>
      <div className="profile_modal">
        <header className="modal_header">
          <button onClick={() => setOpen(false)}>X</button>
        </header>

        <div className="profile_content">
          <form action="post">
            {/* img section */}
            <div className="profile_img_box">
              <span className="profile_img_circle">
                <img src={user.profile_img} alt="" />
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

        <footer className="modal_footer">
          <button>변경하기</button>
        </footer>
      </div>
    </div>
  );
};
