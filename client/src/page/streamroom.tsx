import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stream_service } from "../service/stream.service";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

// component
import { createFormData } from "../util/form";
import { connectRoom } from "../util/stream";
import { Menu } from "../components/room/menu";
import { Stream } from "../components/room/stream";
import { useSetStream, useStream } from "../context/stream.context";
import { useDispatch } from "react-redux";

// css
import * as STR from "../css/room/stream.style";
import { emitter } from "../util/event";

export const StreamRoom = () => {
  let { room } = useStream();
  let { setRoom } = useSetStream();
  let { id } = useParams();
  // using

  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);

  // 방 연결
  useEffect(() => {
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

    roomConnect();
  }, []);

  useEffect(() => {}, [room]);

  return (
    <>
      <STR.StreamGlobal />
      <STR.StreamPage>
        {/* 참가자들의 화면 부분 */}
        <Stream />
        {/* 참가자들 채팅 / 참가자 목록 */}
        <Menu />
      </STR.StreamPage>
    </>
  );
};
