// css
import "./css/App.css";

import React, { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { userAction } from "./context/actions/userAction";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./context/store";

// page
import { Home } from "./page/home";
import { Notfound } from "./page/notfound";
import { StreamRoom } from "./page/streamroom";
import { Login } from "./page/login";
import { Signup } from "./page/signup";

function App() {
  let dispatch = useDispatch<AppDispatch>();
  let location = useLocation();

  useEffect(() => {
    let test = async () => {
      try {
        await dispatch(userAction.getUserAction()).unwrap();
      } catch (err: any) {
        let path = location.pathname;
        if (path != "/login" && path != "/signup") return;
        window.location.href = "/login";
      }
    };
    test();
  }, [dispatch]);

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
