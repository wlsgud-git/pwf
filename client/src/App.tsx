// css
import "./css/App.css";

import React, { useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { userAction } from "./redux/actions/userAction";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";

// page
import { Home } from "./page/home";
import { Notfound } from "./page/notfound";
import { StreamRoom } from "./page/streamroom";
import { Login } from "./page/login";
import { Signup } from "./page/signup";
import { useSelector } from "react-redux";
import { Modal } from "./page/modal";
import { Profile } from "./page/profile";
import { PasswordReset } from "./page/passwordReset";
import { StreamProvider } from "./context/stream.context";
import { socketClient } from "./util/socket";
import { friendOnlineUpdate } from "./redux/reducer/friendReducer";
import { insertUser, inviteRoom } from "./redux/reducer/roomReducer";

function App() {
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);
  let location = useLocation();
  let navigate = useNavigate();

  // 로그인이 안 되어 있으면 로그인 페이지로
  useEffect(() => {
    let test = () => {
      dispatch(userAction.getUserAction())
        .unwrap()
        .catch((err: any) => {
          // let path = location.pathname;
          // if (
          //   path === "/login" ||
          //   path === "/signup" ||
          //   path === "/authcode/fcipras8694@naver.com"
          // )
          //   return;
          // navigate("/login");
        });
    };
    if (!user.id) test();
  }, [dispatch]);

  useEffect(() => {
    // 친구 온라인 업데이트
    socketClient.on("update_friend_online", (data) =>
      dispatch(friendOnlineUpdate(data))
    );

    // 방 초대
    socketClient.on("invite room", (room) => dispatch(inviteRoom(room)));
    // 방에 새로운 유저가 들어옴
    socketClient.on("insert user", (data) => dispatch(insertUser(data)));

    return () => {
      socketClient.off("update_friend_online", (data) =>
        dispatch(friendOnlineUpdate(data))
      );
      socketClient.off("invite room", (room) => dispatch(inviteRoom(room)));
      socketClient.off("insert user", (data) => dispatch(insertUser(data)));
    };
  }, []);

  return (
    <div className="App">
      <Modal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/room/:id"
          element={
            <StreamProvider>
              <StreamRoom />
            </StreamProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:email" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
