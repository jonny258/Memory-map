import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//pages
import Login from "./pages/login";
import Signup from "./pages/signup";
import OldHome from "./pages/oldHomeFile";
import Home from "./pages/home";
import Social from "./pages/Social";

function App() {
  const fetchRequest = async (method, url, body) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [userState, setUserState] = useState(null);

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={<Home userState={userState} setUserState={setUserState} fetchRequest={fetchRequest}/>}
          />
          <Route path="/social" element={<Social />} />
          <Route path="/oldhome" element={<OldHome />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
