import React from "react";

function MarkersInViewCard({ point, viewPointInMapHandler }) {
  return (
    <li className="flex justify-between items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded">
      <h6 className="text-gray-700">{point.title}</h6>
      <div>
        <button
          className="btn btn-info"
          onClick={() => viewPointInMapHandler(point)}
        >
          View
        </button>
      </div>
    </li>
  );
}

export default MarkersInViewCard;
