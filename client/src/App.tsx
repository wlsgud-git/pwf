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

function App() {
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    let test = () => {
      if (user.id) return;
      dispatch(userAction.getUserAction())
        .unwrap()
        .catch((err: any) => {
          let path = location.pathname;
          if (path === "/login" || path === "/signup") return;
          navigate("/login");
        });
    };
    test();
  }, [dispatch]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<StreamRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
