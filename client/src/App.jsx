import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import OldHome from "./pages/oldHomeFile";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route index element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/oldhome" element={<OldHome />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
