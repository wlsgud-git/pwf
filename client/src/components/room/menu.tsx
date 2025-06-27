import { useEffect, useState } from "react";

import { emitter } from "../../util/event";

// css
import "../../css/room/menu.css";

// component
import { Chat } from "./chat";
import { Participants } from "./participants";
import { User } from "../../types/user";
import { Room } from "../../types/room";

export const Menu = () => {
  let [menu, setMenu] = useState<boolean>(false);
  return (
    <div className="pwf-stream_menu">
      <button className="stream_menu_btn" onClick={() => setMenu(!menu)}>
        <i className={`fa-solid fa-chevron-${menu ? "right" : "left"}`}></i>
      </button>

      <ul
        className="stream_menu_content"
        style={{ width: menu ? "var(--stream-menu-size)" : "0px" }}
      >
        <button title="오디오">
          <i className="fa-solid fa-microphone-lines"></i>
        </button>
        {/* 비디오 */}
        <button title="비디오">
          <i className="fa-solid fa-video"></i>
        </button>
        {/* 방에 친구초대 */}
        <button title="초대">
          <i className="fa-solid fa-user-plus"></i>
        </button>
        {/* 화면공유 */}
        <button title="화면공유">
          <i className="fa-brands fa-creative-commons-share"></i>
        </button>
        {/* 내 미디어 변경 */}
        <button title="내 미디어">
          <i className="fa-solid fa-desktop"></i>
        </button>
        {/* 채팅 */}
        <button title="채팅">
          <i className="fa-solid fa-comments"></i>
        </button>
        <button title="참가자">
          <i className="fa-solid fa-user"></i>
        </button>

        {/* 방 나가기 */}
        <button className="room_exit" title="방 나가기">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </ul>
    </div>
  );
};
