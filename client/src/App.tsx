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

import { userAction } from "./context/actions/userAction";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./context/store";

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
          let path = location.pathname;
          if (
            path === "/login" ||
            path === "/signup" ||
            path === "/authcode/fcipras8694@naver.com"
          )
            return;
          navigate("/login");
        });
    };
    if (!user.id) test();
  }, [dispatch]);

  return (
    <div className="App">
      <Modal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<StreamRoom />} />
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
