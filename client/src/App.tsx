// css
import "./css/App.css";

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// page
import { Home } from "./page/home";
import { Notfound } from "./page/notfound";
import { Result } from "./page/result";
import { Login } from "./page/login";
import { Signup } from "./page/signup";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
