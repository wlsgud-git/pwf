// css
import "../css/home.css";

import { emitter } from "../util/event";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AppDispatch, RootState } from "../context/store";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../context/actions/userAction";
import { socketClient, userSocket } from "../util/socket";

// component
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
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);

  let [time, settime] = useState(10);
  let intervalRef = useRef<any>(null);

  function minus() {
    // if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      settime((c) => c - 1);
    }, 1000);
  }

  const restart = () => {
    settime(10);
    minus();
  };

  const breaker = () => clearInterval(intervalRef.current);

  useEffect(() => {
    if (time <= 0) breaker();
  }, [time]);

  return (
    <div className="page home_page">
      {/* header */}
      <PageHeader />

      {/* content */}
      <div className="pwf_content">
        <span className="test">{time}</span>
        <button onClick={minus}>click</button>
        <button onClick={restart}>restart</button>
        {/* 내가 참가자인 방 모음 */}
        <ul className="stream_room_lists">
          {user.stream_room && user.stream_room.length
            ? user.stream_room.map((val) => <StreamRoomLi data={val} />)
            : ""}
          <button
            onClick={() =>
              emitter.emit("modal", { type: "stream", open: true })
            }
          >
            방만들기
          </button>

          {/* {Object.entries(test).map(([id, info]))} */}
        </ul>
        {/* 내 친구 리스트 */}
        <Suspense fallback={<div>loading...</div>}>
          <MyFriends />
        </Suspense>
      </div>
    </div>
  );
};
