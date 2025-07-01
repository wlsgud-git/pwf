import "../css/room/streamRoom.css";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../util/socket";
import { stream_service } from "../service/stream.service";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";
import {
  Track,
  Room,
  RemoteParticipant,
  RemoteTrackPublication,
  createLocalTracks,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteVideoTrack,
} from "livekit-client";

// type
// import { Room } from "../types/room";
import { User } from "../types/user";
import { PeerConnects } from "../types/room";

// component
import { createFormData } from "../util/form";
import {
  connectRoom,
  getMediaStream,
  getStream,
  getTrack,
} from "../util/stream";
// import {
//   ControlBar,
//   GridLayout,
//   LiveKitRoom,
//   TrackReferenceOrPlaceholder,
//   ParticipantTile,
//   useTracks,
// } from "@livekit/components-react";
// import "@livekit/components-styles";

// const Participant = ({trackRef} : {trackRef: TrackReferenceOrPlaceholder}): React.JSX.Element =>{
//   return <ParticipantTile trackRef={trackRef}
// }

// export function TrackDisplay() {
//   const tracks = useTracks([
//     { source: Track.Source.Camera, withPlaceholder: true },
//     { source: Track.Source.Microphone, withPlaceholder: true },
//   ]);

//   useEffect(() => {
//     console.log(tracks);
//   }, [tracks]);

//   return (
//     <div>
//       <GridLayout tracks={tracks} children={(track:TrackReferenceOrPlaceholder):React.JSX.Element =>{
//         return <ParticipantTile trackRef={track} />
//       }} />
//         {/* {(track)=> <Participant track={track} /> }
//       </GridLayout> */}
//     </div>
//   );
// }

export const StreamRoom = () => {
  // using
  let user = useSelector((state: RootState) => state.user);
  let { id } = useParams();
  let navigate = useNavigate();
  let [token, setToken] = useState<string>("");

  // menu
  let [menu, setMenu] = useState<boolean>(false);

  // pariticipant
  let [participant, setParticipant] = useState<{
    [nickname: string]: {
      video: boolean;
      audio: boolean;
    };
  }>({});

  // track
  let localRef = useRef<HTMLVideoElement | null>(null);
  let videoTrack = useRef<LocalVideoTrack | null>(null);
  let audioTrack = useRef<LocalAudioTrack | null>(null);

  let testRef = useRef<HTMLVideoElement | null>(null);

  let [audio, setAudio] = useState<boolean>(true);
  let [video, setVideo] = useState<boolean>(true);

  // share
  let [share, setShare] = useState<boolean>(false);

  // init ------------------------------------------
  useEffect(() => {
    let start = async () => {
      try {
        let token = await stream_service.roomAccessToken(
          createFormData({ room: `room${id}`, identity: user.nickname })
        );
        setToken(token);
      } catch (err) {
        console.log(err);
      }
    };
    start();
  }, []);

  useEffect(() => {
    let test = async () => {
      try {
        const room = await connectRoom(token);
        const tracks = await getStream(audio, video);

        // const stream = getMediaStream(tracks!);
        // if (localRef.current) localRef.current.srcObject = stream;

        videoTrack.current = getTrack(tracks!, "video") as LocalVideoTrack;
        audioTrack.current = getTrack(tracks!, "audio") as LocalAudioTrack;

        if (videoTrack.current && localRef.current) {
          await room.localParticipant.publishTrack(videoTrack.current);
          videoTrack.current.attach(localRef.current);
        }
        if (audioTrack.current && localRef.current) {
          await room.localParticipant.publishTrack(audioTrack.current);
          audioTrack.current.attach(localRef.current);
        }

        // 새 참가자 관련
        room.on("participantConnected", (participant: RemoteParticipant) => {
          console.log("새 참가자:", participant.identity);

          participant.on("trackSubscribed", (track) => {
            console.log("hihi");
            if (track.kind == "video" && testRef.current) {
              let remoteTrack = track as RemoteVideoTrack;
              remoteTrack.attach(testRef.current);
            }
          });

          participant.on("trackMuted", (track) => {
            console.log(
              `${participant.identity}의 ${
                track.kind == "audio" ? "오디오" : "비디오"
              }트랙이 꺼짐`
            );
          });

          participant.on("trackUnmuted", (track) => {
            console.log(
              `${participant.identity}의 ${
                track.kind == "audio" ? "오디오" : "비디오"
              }트랙이 켜짐`
            );
          });

          // participant.on("track");
        });

        // 기준 참가자 관련
        room.remoteParticipants.forEach((participant) => {
          participant.getTrackPublications().forEach((pub) => {
            console.log("트랙 종류:", pub.kind);
          });
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (token !== "") test();

    return () => {
      videoTrack.current?.detach();
      videoTrack.current?.stop();
      audioTrack.current?.stop();
      // room?
    };
  }, [token]);

  // track
  const toggleTrack = (type: "audio" | "video") => {
    if (!localRef.current) return;
    let stream = localRef.current.srcObject as MediaStream;
    if (type == "video") {
      if (!videoTrack.current) return;

      // console.log(`현재 비디오는 ${video}상태 이고 ${!video}로 바뀌는 과정`);
      // stream.getVideoTracks().forEach((track) => (track.enabled = !video));
      video ? videoTrack.current.mute() : videoTrack.current.unmute();
      setVideo((c) => !c);
    } else {
      if (!audioTrack.current) return;

      // console.log(`현재 오디오는 ${audio}상태 이고 ${!video}로 바뀌는 과정`);
      // stream.getAudioTracks().forEach((track) => (track.enabled = !audio));
      audio ? audioTrack.current.mute() : audioTrack.current.unmute();
      setAudio((c) => !c);
    }
  };

  // share
  function sharing() {
    setShare((c) => !c);
  }

  return (
    <div className="page streamRoom_page">
      {/* <video className="pppp" src="#" ref={localRef} autoPlay></video> */}
      {/* 방 메인화면 */}

      <div className="pwf-stream_container">
        {/* 참가자 화면 */}
        <ul className="participant_stream_container">
          <div className="participant_track_box">
            <video ref={localRef} autoPlay></video>
            <div className="participant_infomation">
              <span>
                <i
                  className={`fa-solid fa-microphone${audio ? "" : "-slash"}`}
                ></i>
              </span>
              <span>
                <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
              </span>
              <span>{user.nickname}</span>
            </div>
          </div>

          <div className="participant_track_box">
            <video ref={testRef} autoPlay></video>
            <div className="participant_infomation">
              {/* <span>
                <i
                  className={`fa-solid fa-microphone${audio ? "" : "-slash"}`}
                ></i>
              </span>
              <span>
                <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
              </span> */}
              <span>{user.nickname}</span>
            </div>
          </div>
        </ul>
        {/* 공유 화면 */}
        <div
          className="share_stream_container"
          style={{ display: share ? "flex" : "none" }}
        >
          <div className="share_screen_box">
            {/* <video ref={localRef} className="share_test" autoPlay></video> */}
            <span className="share_user">administer</span>
          </div>
        </div>
      </div>

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
          <button title="오디오" onClick={() => toggleTrack("audio")}>
            <i className={`fa-solid fa-microphone${audio ? "" : "-slash"}`}></i>
          </button>
          {/* 비디오 */}
          <button title="비디오" onClick={() => toggleTrack("video")}>
            <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
          </button>
          {/* 방에 친구초대 */}
          <button title="초대">
            <i className="fa-solid fa-user-plus"></i>
          </button>
          {/* 화면공유 */}
          <button title="화면공유" onClick={sharing}>
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
