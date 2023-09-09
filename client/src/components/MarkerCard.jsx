import React from "react";
import { SplideSlide } from "@splidejs/react-splide";

function MarkerCard({
  point,
  index,
  deleteButtonHandler,
  editAndViewCardHandler,
}) {
  return (
    <SplideSlide>
      <div className="card card-compact w-72 bg-base-100 shadow-xl">
        <figure>
          <img
            src={point.media}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-white">{point.title}</h2>
          <p className="text-white">{point.description}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                editAndViewCardHandler(point.lng, point.lat, index, false);
              }}
            >
              View
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                deleteButtonHandler(index);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </SplideSlide>
  );
}

export default MarkerCard;
