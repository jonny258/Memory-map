import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../../pages/UserModal";
import Auth from '../../utils/auth'

function Nav({initialState}) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(initialState);

  const logoutButtonHandler = async () => {
    try {
      Auth.logout()
      setShowUserModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="absolute top-0 right-[20vw] z-10">
        <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
          <button
            className="btn btn-warning rounded-none"
            onClick={logoutButtonHandler}
          >
            Log Out
          </button>
          <button
            className="btn btn-primary rounded-none"
            onClick={() => {
              console.log("AAAA");
            }}
          >
            Home
          </button>
          <button
            className="btn btn-accent rounded-none"
            onClick={() => setProfileModalOpen(true)}
          >
            Profile
          </button>
        </div>
      </div>
      {showUserModal && <User handleClose={() => {
            setShowUserModal(false);
          }}/>}
    </>
  );
}

export default Nav;
