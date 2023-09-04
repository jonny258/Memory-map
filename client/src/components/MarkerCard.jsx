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
            src="https://upcdn.io/FW25bUs/image/uploads/2023/08/05/Doyle_Brunson_high_res_feature-512x275-5rrX.jpg.crop?w=600&h=600&fit=max&q=70"
            alt="Shoes"
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
