import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { socketClient } from "../../../util/socket";
import { emitter } from "../../../util/event";

// css
import "../../../css/room/main/roomMain.css";
import "../../../css/invitation.css";

// type
import { User } from "../../../types/user";
import { Room } from "../../../types/room";
import { PeerConnects } from "../../../types/room";
import { FriendStream } from "../friendStream";
import { info } from "console";

interface RoomMainProps {
  user: User;
  stream: MediaStream | null;
  connects: object;
  participants: Room["participants"];
}

interface InvitationProps {
  user: User;
  show: boolean;
  setShow: any;
  participants: Room["participants"];
}

const InvitationLi = ({ user }: { [user: string]: User }) => {
  return (
    <li className="invitation_li">
      {/* 유저 정보 */}
      <div>
        <span className="invitation_profile_box">
          <img src={user.profile_img} />
        </span>
        <span className="invitation_nickname">{user.nickname}</span>
      </div>
      {/* 초대버튼 */}
      <button>초대</button>
    </li>
  );
};

// 친구 관련 모달
export const Invitation = ({
  user,
  show,
  setShow,
  participants,
}: InvitationProps) => {
  function reset() {
    setShow(false);
    emitter.emit("modal", { type: "friend" });
  }
  return (
    <div
      className="invitation_modal"
      style={{ display: show ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <ul className="invitation_list">
        {user.friends?.length &&
          user.friends.map((val) => <InvitationLi user={user} />)}
      </ul>
    </div>
  );
};

export const RoomMain = ({
  user,
  stream,
  connects,
  participants,
}: RoomMainProps) => {
  let { id } = useParams();
  let roomId = `room${id}`;
  let navigate = useNavigate();

  let localRef = useRef<HTMLVideoElement | null>(null);
  let localStreamRef = useRef<MediaStream | null>(null);

  let shareStreamRef = useRef<HTMLVideoElement | null>(null);

  let [audio, setAudio] = useState<boolean>(true);
  let [video, setVideo] = useState<boolean>(true);

  let [otherShare, setOtherShare] = useState<{
    state: boolean;
    nickname: string;
  }>({ state: false, nickname: "" });
  let [shareStream, setShareStream] = useState<MediaStream | null>(null);
  let [showInvitation, setShowInvitation] = useState<boolean>(false);

  let openModal = () => {
    setShowInvitation(true);
    emitter.emit("modal", { type: "invitation", open: true });
  };

  // 다른 사용자 트랙 변경
  let trackChange = (stream: any) => {
    Object.entries(connects).forEach(([from, info]) => {
      let sender = info.pc
        .getSenders()
        .find((s: any) => s.track.kind == "video");
      if (sender) sender.replaceTrack(stream);
    });
  };

  // 화면 공유 과정
  let changeProcess = (
    streamTrack: MediaStreamTrack | undefined,
    stream: MediaStream | null,
    state: boolean
  ) => {
    state
      ? socketClient.emit("share screen", roomId, user.nickname)
      : socketClient.emit("share screen off", roomId);

    setShareStream(stream);
    trackChange(streamTrack);
    setOtherShare((c) => ({ ...c, state, nickname: user.nickname! }));
  };

  //내 화면 공유 시작
  let ShareStart = async () => {
    if (otherShare.state) {
      alert("다른 이가 화면공유 중입니다");
      return;
    }
    try {
      let s_stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      let streamTrack = s_stream.getVideoTracks()[0];

      changeProcess(streamTrack, s_stream, true);

      streamTrack.onended = () => {
        changeProcess(stream?.getVideoTracks()[0], null, false);
      };
    } catch (err) {
      console.log(err);
    }
  };

  // 다른 사용자가 화면 공유를 시작함
  let otherScreenShare = (from: string) => {
    setOtherShare((c) => ({ ...c, state: true, nickname: from }));
  };

  // 다른 사용자가 화면 공유를 종료함
  let otherSCreenShareOFf = () => {
    setShareStream(null);
    setOtherShare((c) => ({ ...c, state: false, nickname: "" }));
  };

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

  // useEffect ---------------

  // 스트림 ref 설정
  useEffect(() => {
    if (stream) {
      localRef.current!.srcObject = stream;
      localStreamRef.current = stream;
    }
  }, [stream]);

  // 화면공유 소켓 초기화
  useEffect(() => {
    socketClient.on("share screen", otherScreenShare);
    socketClient.on("share screen off", otherSCreenShareOFf);

    return () => {
      socketClient.off("share screen", otherScreenShare);
      socketClient.on("share screen off", otherSCreenShareOFf);
    };
  }, []);

  // 상대가 화면 공유 시작시 상대방의 비디오 트랙을 shareSTream으로 설정
  useEffect(() => {
    let con = Object.entries(connects);
    if (con.length && otherShare.state && otherShare.nickname !== "") {
      let shareInfo = con.find(([from, info]) => from === otherShare.nickname);
      if (shareInfo) {
        let info = shareInfo[1];
        info.pc.getReceivers().forEach((receive: any) => {
          setShareStream(new MediaStream([receive.track]));
        });
      }
    }
  }, [connects, otherShare.nickname]);

  // 공유 스트림이 변경되면 공유 ref.srcObject 변경
  useEffect(() => {
    if (shareStream && shareStreamRef.current) {
      shareStreamRef.current.srcObject = shareStream;
    }
  }, [shareStream]);

  return (
    <div className="pwf-streamRoom_container">
      {/* modal */}
      <Invitation
        user={user}
        show={showInvitation}
        setShow={setShowInvitation}
        participants={participants}
      />
      {/* 화면창 */}
      <div className="pwf-screen_container">
        {/* p2p 연결화면들 */}
        <ul className={otherShare.state ? "share" : "user_screen_lists"}>
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
                  <i
                    className={`fa-solid fa-video${video ? "" : "-slash"}`}
                  ></i>
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
        {/* 화면 공유시 공유창 */}
        <div
          className="share_screen_container"
          style={{ display: otherShare.state ? "flex" : "none" }}
        >
          <video
            ref={shareStreamRef}
            autoPlay
            playsInline
            className="share_video"
          ></video>
          <span className="share_user_nickname">{otherShare.nickname}</span>
        </div>
      </div>
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
          {/* 방에 친구초대 */}
          <button onClick={openModal}>
            <i className="fa-solid fa-user-plus"></i>
            <span>초대</span>
          </button>
          {/* 화면공유 */}
          <button
            onClick={ShareStart}
            style={{ color: otherShare.state ? "var(--pwf-blue)" : "white" }}
          >
            <i className="fa-brands fa-creative-commons-share"></i>
            <span>화면공유</span>
          </button>
          {/* 내 미디어 변경 */}
          <button>
            <i className="fa-solid fa-desktop"></i>
            <span>내 미디어</span>
          </button>
          {/* 메뉴 */}
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
