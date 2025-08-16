// css
import * as SHOME from "../css/page/home.style";
import "../css/home.css";

import { emitter } from "../util/event";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AppDispatch, RootState } from "../redux/store";
import { useSelector } from "react-redux";

// component
import { Modal } from "../components/modal/modal.component";
import { PageHeader } from "../components/views/pageHeader";
import { useDispatch } from "react-redux";
import { modalState } from "../redux/reducer/modalReducer";

// const Page

const MyFriends = lazy(() =>
  import("../components/views/myFriend").then(({ MyFriends }) => ({
    default: MyFriends,
  }))
);
const StreamRoomLi = lazy(() =>
  import("../components/views/roomLi").then(({ StreamRoomLi }) => ({
    default: StreamRoomLi,
  }))
);

export const Home = () => {
  let dispatch = useDispatch<AppDispatch>();
  let room = useSelector((state: RootState) => state.room);

  return (
    <SHOME.HomePage>
      {/* header */}
      <PageHeader />

      {/* content */}
      <div className="pwf_content">
        {/* 내가 참가자인 방 모음 */}
        <ul className="stream_room_lists">
          {Object.entries(room).length
            ? Object.entries(room).map(([key, value]) => (
                <StreamRoomLi data={value} />
              ))
            : ""}

          <button
            onClick={() =>
              dispatch(modalState({ active: true, type: "stream" }))
            }
          >
            방만들기
          </button>

          {/* {Object.entries(test).map([id, info])} */}
        </ul>
        {/* 내 친구 리스트 */}
        <Suspense fallback={<div>loading...</div>}>
          <MyFriends />
        </Suspense>
      </div>
    </SHOME.HomePage>
  );
};
