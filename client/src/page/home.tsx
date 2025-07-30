// css
import "../css/home.css";

import { emitter } from "../util/event";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

// component
import { Modal } from "../components/modal/modal.component";
import { PageHeader } from "../components/pageHeader";

const MyFriends = lazy(() =>
  import("../components/myFriend").then(({ MyFriends }) => ({
    default: MyFriends,
  }))
);
const StreamRoomLi = lazy(() =>
  import("../components/roomLi").then(({ StreamRoomLi }) => ({
    default: StreamRoomLi,
  }))
);

export const Home = () => {
  let room = useSelector((state: RootState) => state.room);

  return (
    <div className="page home_page">
      <Modal />
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
              emitter.emit("modal", { type: "stream", open: true })
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
    </div>
  );
};
