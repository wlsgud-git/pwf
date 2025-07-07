import "../css/room/streamRoom.css";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../util/socket";
import { stream_service } from "../service/stream.service";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Track,
  Room,
  RemoteParticipant,
  RemoteTrackPublication,
  createLocalTracks,
  LocalVideoTrack,
  LocalAudioTrack,
  RemoteVideoTrack,
  RemoteAudioTrack,
  RemoteTrack,
  LocalTrack,
  TrackPublication,
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
import {
  LocalTrackProps,
  RemoteTrackProps,
  TrackProps,
  UserTrackProps,
} from "../types/stream.types";
import { Menu } from "../components/room/menu";
import { Stream } from "../components/room/stream";
import { useSetStream, StreamContext } from "../context/stream.context";
import { useContextSelector } from "use-context-selector";

export const StreamRoom = () => {
  let { id } = useParams();
  let navigate = useNavigate();
  // using
  let user = useSelector((state: RootState) => state.user);
  let room = useContextSelector(StreamContext, (ctx) => ctx.room);

  let { setRoom, setParticipants, setShare } = useSetStream();

  let [token, setToken] = useState<string>("");

  // 방 연결
  let roomConnect = async () => {
    try {
      let room = await connectRoom(token);
      setRoom(room);
    } catch (err) {
      console.log(err);
    }
  };

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

  // token으로 room 연결
  useEffect(() => {
    if (token == "") return;
    roomConnect();
  }, [token]);

  return (
    <div className="page streamRoom_page">
      {/* 참가자들의 화면 부분 */}
      <Stream />
      {/* 참가자들 채팅 / 참가자 목록 */}
      <Menu />
    </div>
  );
};
