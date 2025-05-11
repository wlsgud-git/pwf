import { useState } from "react";
import "../css/streamRoom.css";

export const StreamRoom = () => {
  let [menu, setMenu] = useState<boolean>(true);

  let [voice, setVoice] = useState<boolean>(true);
  let [video, setVideo] = useState<boolean>(true);

  return (
    <div className="page streamRoom_page">
      {/* main */}
      <div className="pwf-streamRoom_container">
        {/* main footer */}
        <footer className="streamRoom_footer">
          {/* 유저 음성 및 비디오 */}
          <div className="user_video_options">
            {/* 음성 */}
            <button
              title={`음소거${voice ? "" : " 해제"}`}
              onClick={() => setVoice(!voice)}
            >
              <i
                className={`fa-solid fa-microphone-lines${
                  voice ? "" : "-slash"
                }`}
              ></i>
            </button>
            {/* 비디오 */}
            <button
              title={`비디오${video ? "" : " 해제"}`}
              onClick={() => setVideo(!video)}
            >
              <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
            </button>
          </div>
          {/* 비디오 메뉴 */}
          <div className="room_options">
            <button title="친구초대">
              <i className="fa-solid fa-user-plus"></i>
            </button>

            <button title="화면공유">화공</button>
          </div>
          {/* 방 나가기 */}
          <button className="room_exit">방나가기</button>
        </footer>
      </div>
      {/* menu */}
      <div className="pwf-streamRoom_menu"></div>
    </div>
  );
};
