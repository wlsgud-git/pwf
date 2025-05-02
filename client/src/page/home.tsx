// css
import "../css/home.css";

import { emitter } from "../util/event";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { AppDispatch, RootState } from "../context/store";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../context/actions/userAction";

// component
import { Modal } from "./modal";
import { PageHeader } from "../components/pageHeader";
const MyFriends = lazy(() =>
  import("../components/myFriend").then(({ MyFriends }) => ({
    default: MyFriends,
  }))
);

export const Home = () => {
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(userAction.getUserAction());
  }, [dispatch]);

  return (
    <div className="page home_page">
      {/* header */}
      <PageHeader />

      {/* streamroom modal */}
      <Modal />

      {/* content */}
      <div className="pwf_content">
        {/* 내가 참가자인 방 모음 */}
        <ul className="stream_room_lists">
          <button onClick={() => emitter.emit("modal", "stream")}>
            방만들기
          </button>
        </ul>
        {/* 내 친구 리스트 */}
        <Suspense fallback={<div>loading...</div>}>
          <MyFriends />
        </Suspense>
      </div>
    </div>
  );
};
