import React, { useState, useRef } from "react";
import Signup from "../components/UserTerminal/Signup";
import SignupPlus from "../components/UserTerminal/SignupPlus";
import Login from "../components/UserTerminal/Login";

//Make this a modal
function User({ fetchRequest, setUserState, handleClose }) {
  const [showSignup, setShowSignup] = useState(true);
  const [showSignupPlus, setShowSignupPlus] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const modalContentRef = useRef(null);
  return (
    <>
    {/* Backdrop */}
    <div
      className="fixed z-40 top-0 left-0 w-full h-full bg-black opacity-50"
      
    ></div>

    {/* Modal Container */}
    <div
      className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
      tabIndex="-1"
      role="dialog"
      onClick={(event) => {
        if (
          modalContentRef.current &&
          !modalContentRef.current.contains(event.target)
        ) {
          handleClose();
        }
      }}
    >
      {/* Modal Content */}
      <div
        className="modal modal-open"
      >
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
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}

            />
          )}
          {showSignupPlus && (
            <SignupPlus
              setUserState={setUserState}
              fetchRequest={fetchRequest}
              setShowSignup={setShowSignup}
              setShowSignupPlus={setShowSignupPlus}
              email={email}
              password={password}
              name={name}
              setName={setName}
            />
          )}
          {showLogin && (
            <Login
              setUserState={setUserState}
              fetchRequest={fetchRequest}
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

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-300">
      <section className="p-5 rounded-xl bg-gray-500 max-h-screen">
        <div className="flex flex-col space-y-4">
          {showSignup && (
            <Signup
              setShowLogin={setShowLogin}
              setShowSignup={setShowSignup}
              setShowSignupPlus={setShowSignupPlus}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}

            />
          )}
          {showSignupPlus && (
            <SignupPlus
              setUserState={setUserState}
              fetchRequest={fetchRequest}
              setShowSignup={setShowSignup}
              setShowSignupPlus={setShowSignupPlus}
              email={email}
              password={password}
              name={name}
              setName={setName}
            />
          )}
          {showLogin && (
            <Login
              setUserState={setUserState}
              fetchRequest={fetchRequest}
              setShowLogin={setShowLogin}
              setShowSignup={setShowSignup}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default User;
