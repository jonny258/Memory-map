import React from "react";

function MarkersInViewCard({ point, viewPointInMapHandler }) {
  console.log(point);
  return (
    <div className="bg-gray-300 border justify-between my-1 rounded-lg w-full flex items-center">
      <img
        src={point.media}
        class="w-12 h-12 rounded-full border-2 border-gray-300 shadow-lg object-cover"
      />
      <h2 className="px-4 py-2 text-gray-700 truncate flex-grow">
        {point.title}
      </h2>
      <button
        className="btn btn-outline btn-primary"
        onClick={() => viewPointInMapHandler(point)}
      >
        View
      </button>
    </div>
  );
}

export default MarkersInViewCard;
