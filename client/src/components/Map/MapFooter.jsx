import React from "react";
import SearchLocation from "./SearchLocation";

function MapFooter({ mapFly, buttonState, setButtonState }) {
  return (
    <nav className="bg-gray-900 flex items-center justify-between px-48">
      <a className="text-2xl font-bold">Memory Map</a>
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
