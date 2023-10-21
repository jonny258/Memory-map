import React, { useRef } from "react";
import { SplideSlide } from "@splidejs/react-splide";
import { userDataVar } from "../../main";

function UserCard({ user, index, userButtonHandler }) {
  // const memoryCountRef = useRef()

  const handleButtonClick = () => {
    // console.log("Markers length during click:", user.markers.length);
    // if (user.markers.length === 0) {
    //   alert("User has 0 memories");
    //   return;
    // }
    console.log(userDataVar())
    userButtonHandler(user._id);
  };

  return (
    <SplideSlide>
      <div className="card card-compact w-72 bg-base-100 shadow-xl">
        <figure>
          <img src={user.pfp} alt={user.name} />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-white">{user.username}</h2>
          <p className="text-white">
            Memories: <span>{user.markers.length}</span>
          </p>
          <div className="card-actions justify-end">
            {user.markers.length !== 0 && (
              <button className="btn btn-primary" onClick={handleButtonClick}>
                View memories
              </button>
            )}
          </div>
        </div>
      </div>
    </SplideSlide>
  );
}

export default UserCard;
