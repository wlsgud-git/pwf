import "../css/room/streamRoom.css";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stream_service } from "../service/stream.service";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

// type

// component
import { createFormData } from "../util/form";
import { connectRoom } from "../util/stream";
import { Menu } from "../components/room/menu";
import { Stream } from "../components/room/stream";
import { useSetStream, StreamContext } from "../context/stream.context";
import { useContextSelector } from "use-context-selector";
import { Invitation } from "../components/modal/invitation";
import { socketClient } from "../util/socket";
import { useDispatch } from "react-redux";

export const StreamRoom = () => {
  let { id } = useParams();
  // using
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);

  let { setRoom } = useSetStream();

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

  // 방 연결
  useEffect(() => {
    roomConnect();

    // socketClient.on("new participants", dispatch());

    return () => {
      // socketClient.off();
    };
  }, []);

  return (
    <div className="page streamRoom_page">
      {/* 참가자들의 화면 부분 */}
      <Stream />
      {/* 참가자들 채팅 / 참가자 목록 */}
      <Menu />
    </div>
  );
};
