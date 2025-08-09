// css
import "./css/App.css";

import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

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
import { Profile } from "./page/profile";
import { PasswordReset } from "./page/passwordReset";
import { StreamProvider } from "./context/stream.context";
import { socketClient } from "./util/socket";
import {
  deleteFriend,
  friendOnlineUpdate,
  friendReqeustHandle,
  friendRequest,
} from "./redux/reducer/friendReducer";
import { insertUser, inviteRoom } from "./redux/reducer/roomReducer";
import { LoginProvider } from "./context/login.context";
import { SignupProvider } from "./context/signup.context";
import { RouteCheck } from "./components/global/require.component";
import { GlobalStyle } from "./css/global/global.style";
import { setLoading } from "./redux/reducer/userReducer";

function App() {
  let dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socketClient.on("friend_request", (data) => dispatch(friendRequest(data)));
    socketClient.on("friend_request_handle", (data) =>
      dispatch(friendReqeustHandle(data))
    );

    socketClient.on("delete friend", (data) => dispatch(deleteFriend(data)));

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
      socketClient.off("friend_request", (data) =>
        dispatch(friendRequest(data))
      );
      socketClient.off("friend_request_handle", (data) =>
        dispatch(friendReqeustHandle(data))
      );
    };
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <Routes>
        {/* without login */}
        <Route
          path="/login"
          element={
            <RouteCheck type="pub">
              <LoginProvider>
                <Login />
              </LoginProvider>
            </RouteCheck>
          }
        />

        <Route
          path="/signup"
          element={
            <SignupProvider>
              <Signup />
            </SignupProvider>
          }
        />
        {/* with login */}
        {/* 홈 */}
        <Route
          path="/"
          element={
            <RouteCheck type="pri">
              <Home />
            </RouteCheck>
          }
        />
        <Route
          path="/room/:id"
          element={
            <RouteCheck type="pri">
              <StreamProvider>
                <StreamRoom />
              </StreamProvider>
            </RouteCheck>
          }
        />
        <Route path="/profile/:email" element={<Profile />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
