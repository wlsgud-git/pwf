import "../css/room/streamRoom.css";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stream_service } from "../service/stream.service";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// type

// component
import { createFormData } from "../util/form";
import { connectRoom } from "../util/stream";
import { Menu } from "../components/room/menu";
import { Stream } from "../components/room/stream";
import { useSetStream, StreamContext } from "../context/stream.context";
import { useContextSelector } from "use-context-selector";
import { Invitation } from "../components/modal/invitation";

export const StreamRoom = () => {
  let { id } = useParams();
  // using
  let user = useSelector((state: RootState) => state.user);
  let roomInfo = useContextSelector(StreamContext, (ctx) => ctx.roomInfo);

  let { setRoom, setRoomInfo } = useSetStream();

  // 방 연결
  let roomConnect = async () => {
    try {
      let token = await stream_service.roomAccessToken(
        createFormData({ room: `room${id}`, identity: user.nickname })
      );
      let room = await connectRoom(token);
      setRoom(room);
    } catch (err) {
      console.log(err);
    }
  };

  // init ------------------------------------------
  // 방 정보 가져오기
  useEffect(() => {
    let start = async () => {
      try {
        let info = await stream_service.getStreamRoomData(id!);
        setRoomInfo(info.room);
      } catch (err) {
        console.log(err);
      }
    };
    start();
  }, []);

  // 방 연결
  useEffect(() => {
    if (!roomInfo) return;
    roomConnect();
  }, [roomInfo]);

  return (
    <div className="page streamRoom_page">
      {/* 참가자들의 화면 부분 */}
      <Stream />
      {/* 참가자들 채팅 / 참가자 목록 */}
      <Menu />
    </div>
  );
};
