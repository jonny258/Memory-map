import React, { useState, useRef } from "react";
import Signup from "../components/UserModal/Signup";
import SignupPlus from "../components/UserModal/SignupPlus";
import Login from "../components/UserModal/Login";
import { makeVar } from "@apollo/client";

export const userInputVar = makeVar({
  email: "",
  password: "",
  username: "",
  pfp: "",
  color: "",
})


function User({ handleClose }) {
  const [showSignup, setShowSignup] = useState(true);
  const [showSignupPlus, setShowSignupPlus] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const modalContentRef = useRef(null);
  return (
    <>
      {/* Backdrop */}
      <div className="fixed z-40 top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Modal Container */}
      <div
        className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
        tabIndex="-1"
        role="dialog"
        onClick={(event) => {
          console;
          if (
            modalContentRef.current &&
            !modalContentRef.current.contains(event.target)
          ) {
            handleClose();
          }
        }}
      >
        {/* Modal Content */}
        <div className="modal modal-open">
          <div
            className="modal-box  bg-gray-800 rounded shadow-lg max-w-xl w-full text-white"
            ref={modalContentRef}
          >
            <div className="flex flex-col space-y-4">
              {showSignup && (
                <Signup
                  setShowLogin={setShowLogin}
                  setShowSignup={setShowSignup}
                  setShowSignupPlus={setShowSignupPlus}
                />
              )}
              {showSignupPlus && (
                <SignupPlus
                  setShowSignup={setShowSignup}
                  setShowSignupPlus={setShowSignupPlus}
                />
              )}
              {showLogin && (
                <Login
                  setShowLogin={setShowLogin}
                  setShowSignup={setShowSignup}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
