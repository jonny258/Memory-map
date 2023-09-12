import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../../pages/UserModal";
import ProfileModal from "../ProfileModal";
import Auth from "../../utils/auth";

function Nav({ initialState }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(initialState);

  const logoutButtonHandler = async () => {
    try {
      Auth.logout();
      setShowUserModal(true);
    } catch (err) {
      console.error(err);
    }
  };
  //console.log(Auth.getProfile().data._id)

  return (
    <>
      <div className="absolute top-0 right-[20vw] z-10">
        <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
          <button
            className="btn btn-warning rounded-none"
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
