import React from "react";

function MarkersInViewCard({ point, viewPointInMapHandler }) {
  return (
    <div className="join bg-gray-100 border justify-between border-gray-200 rounded-lg w-full">
      <h2 className="join-item px-4 py-2 text-gray-700">{point.title}</h2>
      <button
        className="join-item btn btn-info"
        onClick={() => viewPointInMapHandler(point)}
      >
        View
      </button>
    </div>
  );
}

export default MarkersInViewCard;
