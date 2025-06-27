import "../css/room/streamRoom.css";

import { useEffect, useRef, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../util/socket";
import { stream_service } from "../service/stream.service";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

// type
import { Room } from "../types/room";
import { User } from "../types/user";
import { PeerConnects } from "../types/room";

// component
import { Menu } from "../components/room/menu";
import { getMyMedia, getStream } from "../util/stream";

export const StreamRoom = () => {
  // using
  let user = useSelector((state: RootState) => state.user);
  let { id } = useParams();
  let navigate = useNavigate();

  // 메뉴 -----------------------------
  let [menu, setMenu] = useState<boolean>(false);

  return (
    <div className="page streamRoom_page">
      {/* 방 메인화면 */}

      {/* 메뉴창 */}
      <div className="pwf-stream_menu">
        <button className="stream_menu_btn" onClick={() => setMenu((c) => !c)}>
          <i className={`fa-solid fa-chevron-${menu ? "right" : "left"}`}></i>
        </button>

        <ul
          className="stream_menu_content"
          style={{ width: menu ? "var(--stream-menu-size)" : "0px" }}
        >
          {/* 오디오 */}
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
          {/* 참가자 */}
          <button title="참가자">
            <i className="fa-solid fa-user"></i>
          </button>

          {/* 방 나가기 */}
          <button className="room_exit" title="방 나가기">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </ul>
      </div>
    </div>
  );
};
