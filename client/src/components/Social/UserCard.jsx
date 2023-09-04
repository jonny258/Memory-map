import React from 'react'
import { SplideSlide } from "@splidejs/react-splide";


function UserCard({ user, index, userButtonHandler }) {
    return (
      <SplideSlide>
        <div className="card card-compact w-72 bg-base-100 shadow-xl">
          <figure>
            <img
              src={user.pfp}
              alt={user.name}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-white">{user.name}</h2>
            <p className="text-white">Memories: {user.markers.length}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => userButtonHandler(user, index)}
              >
                View memories
              </button>
            </div>
          </div>
        </div>
      </SplideSlide>
    );
  }
  

export default UserCard