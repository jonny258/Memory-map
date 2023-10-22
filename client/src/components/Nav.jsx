import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "./Modals/User/UserModal";
import ProfileModal from "./Modals/ProfileModal";
import Auth from "../utils/auth";
import { userDataVar } from "../main";

function Nav({ initialState }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(initialState);

  const logoutButtonHandler = async () => {
    try {
      Auth.logout();
      setShowUserModal(true);
      userDataVar("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="absolute top-0 right-[20vw] z-10">
        <button
          className="btn btn-warning rounded-none rounded-bl"
          onClick={logoutButtonHandler}
        >
          {Auth.loggedIn() ? "Log Out" : "Sign Up"}
        </button>
        {Auth.loggedIn() && (
          <button
            className="btn btn-accent rounded-none"
            onClick={() => setShowProfileModal(true)}
          >
            Profile
          </button>
        )}
      </div>
      {showUserModal && (
        <User
          handleClose={() => {
            setShowUserModal(false);
          }}
        />
      )}
      {showProfileModal && (
        <ProfileModal
          userId={Auth.getProfile().data._id}
          handleClose={() => {
            setShowProfileModal(false);
          }}
        />
      )}
    </>
  );
}

export default Nav;
