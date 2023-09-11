import React from "react";
import SearchLocation from "./Home/SearchLocation";

function MapFooter({ mapFly, buttonState, setButtonState }) {
  return (
    <nav className="bg-gray-900 flex items-center justify-between px-48">
      <a className="font-bold text-white">Memory Map</a>
      <button
        className="btn btn-primary w-1/3"
        onClick={() => {
          setButtonState((prev) => !prev);
        }}
      >
        {buttonState ? "CURRENTLY CREATE MODE" : "CURRENTLY VIEW MODE"}
      </button>
      <SearchLocation mapFly={mapFly} />
    </nav>
  );
}

export default MapFooter;
