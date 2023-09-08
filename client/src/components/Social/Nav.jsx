import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Nav({ setShowLogin }) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const logoutButtonHandler = async () => {
    try {
      setShowLogin(true)
      // navigate("/");
      // const sessionUrl = `${API_BASE_URL}/api/session`;
      // const deleteSession = await fetchRequest("DELETE", sessionUrl);
      // console.log(deleteSession);
    } catch (err) {
      console.error(err);
    }
  };

  return (
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
      onClick={()=> {console.log("AAAA")}}
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

  );
}

export default Nav;
