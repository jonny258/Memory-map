import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { makeVar } from "@apollo/client";

//pages
// import Login from "./pages/login";
// import Signup from "./pages/signup";
// import OldHome from "./pages/oldHomeFile";
import Test from "./pages/test";
import Home from "./pages/home";
import Social from "./pages/Social";
import User from "./pages/UserModal";

export const markersInMapVar = makeVar([])

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
          {/* <Route
            index
            element={
              <User
                userState={userState}
                setUserState={setUserState}
                fetchRequest={fetchRequest}
              />
            }
          /> */}
          <Route
            index
            element={
              <Social
                userState={userState}
                setUserState={setUserState}
                fetchRequest={fetchRequest}
              />
            }
          />
          <Route path="/login" element={<Test />} />
          {/* <Route
            path="/signup"
            element={
              <Signup
                userState={userState}
                setUserState={setUserState}
                fetchRequest={fetchRequest}
              />
            }
          /> */}
          <Route
            path="/home"
            element={
              <Home
                userState={userState}
                setUserState={setUserState}
                fetchRequest={fetchRequest}
              />
            }
          />
          {/* <Route
            path="/social"
            element={
              <Social
                userState={userState}
                setUserState={setUserState}
                fetchRequest={fetchRequest}
              />
            }
          />
          <Route path="/oldhome" element={<OldHome />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
