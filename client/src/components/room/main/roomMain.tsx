import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { socketClient } from "../../../util/socket";
import { emitter } from "../../../util/event";

// css
import "../../../css/room/main/roomMain.css";

// type
import { User } from "../../../types/user";
import { PeerConnects } from "../../../types/room";
import { FriendStream } from "../friendStream";

interface RoomMainProps {
  user: User;
  stream: MediaStream | null;
  connects: object;
}

export const RoomMain = ({ user, stream, connects }: RoomMainProps) => {
  let { id } = useParams();
  let roomId = `room${id}`;
  let navigate = useNavigate();

  let localRef = useRef<HTMLVideoElement | null>(null);
  let localStreamRef = useRef<MediaStream | null>(null);

  let [audio, setAudio] = useState<boolean>(true);
  let [video, setVideo] = useState<boolean>(true);

  // 스트림 ref 설정
  useEffect(() => {
    if (stream) {
      localRef.current!.srcObject = stream;
      localStreamRef.current = stream;
    }
  }, [stream]);

  useEffect(() => {
    // console.log(connects);
  }, [connects]);

  // 화면 on/off
  let toggleMedia = (type: "audio" | "video") => {
    let state: boolean = false;
    if (!localStreamRef.current) return;

    localStreamRef.current
      .getTracks()
      .filter((track) => track.kind === type)
      .forEach((track) => {
        state = !track.enabled;
        track.enabled = !track.enabled;
      });

    socketClient.emit("toggle track", roomId, user.nickname, type, state);
    type == "audio" ? setAudio(!audio) : setVideo(!video);
  };

  // 방을 떠남
  let leaveRoom = () => {
    if (user.nickname !== "") {
      socketClient.emit("leave room", user.nickname, roomId);
      navigate("/");
    }
  };

  return (
    <div className="pwf-streamRoom_container">
      {/* 화면창 */}
      <ul className="user_screen_lists">
        {/* 내 화면 */}
        <div className="user_video_box">
          {/* 유저 비디오 */}
          <video
            ref={localRef}
            autoPlay
            playsInline
            className="user_video"
          ></video>
          {/* 유저 정보 */}
          <div className="user_info_box">
            <div>
              <span>
                <i
                  className={`fa-solid fa-microphone-lines${
                    audio ? "" : "-slash"
                  }`}
                ></i>
              </span>
              <span>
                <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
              </span>
            </div>
            <span>{user.nickname}</span>
          </div>
        </div>
        {/* 다른 참가자 스트리밍 */}
        {Object.entries(connects).map(([from, stream]) => (
          <FriendStream from={from} stream={stream} />
        ))}
      </ul>
      {/* main footer */}
      <footer className="streamRoom_footer">
        {/* 유저 음성 및 비디오 */}
        <div className="user_video_options">
          {/* 음성 */}
          <button onClick={() => toggleMedia("audio")}>
            <i
              className={`fa-solid fa-microphone-lines${audio ? "" : "-slash"}`}
            ></i>
            <span>{audio ? "음소거" : "음소거 해제"}</span>
          </button>
          {/* 비디오 */}
          <button
            title={`비디오${video ? "" : " 해제"}`}
            onClick={() => toggleMedia("video")}
          >
            <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
            <span>{video ? "비디오" : "비디오 해제"}</span>
          </button>
        </div>

        {/* 비디오 메뉴 */}
        <div className="room_options">
          <button>
            <i className="fa-solid fa-user-plus"></i>
            <span>초대</span>
          </button>

          <button>
            <i className="fa-brands fa-creative-commons-share"></i>
            <span>화면공유</span>
          </button>

          <button>
            <i className="fa-solid fa-desktop"></i>
            <span>내 미디어</span>
          </button>

          <button onClick={() => emitter.emit("room menu", true)}>
            <i className="fa-brands fa-elementor"></i>
            <span>메뉴</span>
          </button>
        </div>
        {/* 방 나가기 */}
        <button className="room_exit" onClick={leaveRoom}>
          방나가기
        </button>
      </footer>
    </div>
  );
};
