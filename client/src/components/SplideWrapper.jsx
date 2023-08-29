import React, { useEffect, useState, useRef } from "react";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const SplideWrapper = ({ children }) => {
  const splideRef = useRef();

  const goNext = () => {
    splideRef.current.splide.go(">");
  };

  const goPrev = () => {
    splideRef.current.splide.go("<");
  };

  return (
    <div>
      <div className="splide-wrapper border-4 border-black rounded-lg">
        <button
          className="h-full w-12 bg-gray-400 flex justify-center items-center rounded-none z-50"
          onClick={() => goPrev()}
        >
          <p className="text-4xl transform rotate-90">Prev</p>
        </button>
        <Splide
          ref={splideRef}
          hasTrack={false}
          options={{
            rewind: true,
            gap: "1rem",
            perPage: 3,
            perMove: 1,
            arrows: false,
          }}
        >
          <SplideTrack>{children}</SplideTrack>
        </Splide>
        <button
          className="h-full w-12 bg-gray-400 flex justify-center items-center rounded-none z-50"
          onClick={() => goNext()}
        >
          <p className="text-4xl transform rotate-90">Next</p>
        </button>
      </div>
    </div>
  );
};

export default SplideWrapper;
